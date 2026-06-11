import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { DataTypes } from "sequelize";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import { sequelize, dbKind } from "./db.js";
import { TransitionSession } from "./models.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);
app.use(morgan("combined")); // request logging
app.use(compression()); // gzip responses (incl. the static SPA bundle)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);
app.use(express.json({ limit: "16kb" }));

// Anonymous per-browser identity: an httpOnly cookie scopes each visitor to their own
// transition history, so /api/sessions never leaks one user's intentions to another.
app.use((req, res, next) => {
  const cookies = Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((c) => c.trim().split("="))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k, decodeURIComponent(v.join("="))])
  );
  let key = cookies.tk;
  if (!key || !/^[0-9a-f-]{36}$/i.test(key)) {
    key = randomUUID();
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.append("Set-Cookie", `tk=${key}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`);
  }
  req.ownerKey = key;
  next();
});

app.use("/api", rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "ok", db: dbKind });
  } catch (err) {
    console.error("health check failed:", err);
    res.status(500).json({ status: "error", message: "database unavailable" });
  }
});

// Mocked Antwerp -> Brussels plan. ?disrupt=1 shows the disruption-reframe hinge.
app.get("/api/today", (req, res) => {
  const disrupt = req.query.disrupt === "1";
  const base = {
    origin: "Antwerpen-Berchem",
    destination: "Brussel-Centraal",
    train: "IC 1832",
    platform: "5",
    scheduledDeparture: "08:42",
    scheduledArrival: "09:21",
    journeyMinutes: 39,
    firstCommitment: "09:30 team standup",
    crowd: "busy",
    crowdHint: "Board toward the rear — front cars fill first at Berchem.",
    backup: { train: "IC 1809", scheduledDeparture: "09:02", scheduledArrival: "09:42" },
  };

  if (disrupt) {
    return res.json({
      ...base,
      status: "delayed",
      delayMin: 12,
      leaveBy: "08:24",
      arrivalConfidence: 0.74,
      headline: "Heads up — IC 1832 is +12 min. Still 74% you make the 09:30 — backup locked in just in case.",
      reframe: {
        message: "That's 12 minutes you didn't plan for. Bank them?",
        suggestion: "Start a longer Switch-On and use the extra time to prep your standup.",
      },
    });
  }

  return res.json({
    ...base,
    status: "on_time",
    delayMin: 0,
    leaveBy: "08:24",
    arrivalConfidence: 0.92,
    headline: "You're good. Leave by 08:24 for the 08:42 — 92% you make your 09:30 standup.",
    reframe: null,
  });
});

app.get("/api/sessions", async (req, res) => {
  try {
    const sessions = await TransitionSession.findAll({
      where: { ownerKey: req.ownerKey },
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    res.json(sessions.map((s) => s.toJSON()));
  } catch (err) {
    console.error("list sessions failed:", err);
    res.status(500).json({ status: "error", message: "could not load sessions" });
  }
});

app.post("/api/sessions", async (req, res) => {
  try {
    const { type, durationMin, intentions, note, completed } = req.body || {};
    if (type !== "switch_on" && type !== "switch_off") {
      return res.status(400).json({ status: "error", message: "type must be switch_on or switch_off" });
    }
    const dur = Number(durationMin);
    const cleanDuration = Number.isInteger(dur) && dur > 0 && dur <= 600 ? dur : 40;
    const cleanIntentions = Array.isArray(intentions)
      ? intentions.filter((i) => typeof i === "string").slice(0, 5).map((s) => s.slice(0, 200))
      : [];
    const cleanNote = typeof note === "string" ? note.slice(0, 1000) : null;

    const session = await TransitionSession.create({
      ownerKey: req.ownerKey,
      type,
      durationMin: cleanDuration,
      intentions: cleanIntentions,
      note: cleanNote,
      completed: Boolean(completed),
    });
    res.status(201).json(session.toJSON());
  } catch (err) {
    console.error("create session failed:", err);
    res.status(500).json({ status: "error", message: "could not save session" });
  }
});

// Unmatched API routes return JSON 404 (never fall through to the SPA).
app.use("/api", (req, res) => res.status(404).json({ status: "error", message: "not found" }));

if (process.env.NODE_ENV === "production") {
  const pub = path.join(__dirname, "public");
  // Vite assets are content-hashed → safe to cache for a year; the HTML shell must revalidate.
  app.use("/assets", express.static(path.join(pub, "assets"), { maxAge: "1y", immutable: true }));
  app.use(express.static(pub, { maxAge: 0 }));
  app.get("*", (req, res) => {
    res.set("Cache-Control", "no-cache");
    res.sendFile(path.join(pub, "index.html"));
  });
}

async function start() {
  await sequelize.sync();
  // Self-healing migration: plain sync() won't add the ownerKey column to a
  // pre-existing (Postgres) table, so add it if missing. Idempotent, dialect-agnostic.
  try {
    const tableName = TransitionSession.getTableName();
    const cols = await sequelize.getQueryInterface().describeTable(tableName);
    if (!cols.ownerKey) {
      await sequelize.getQueryInterface().addColumn(tableName, "ownerKey", { type: DataTypes.STRING, allowNull: true });
      console.log("migration: added ownerKey column");
    }
  } catch (err) {
    console.error("ownerKey column ensure failed:", err);
  }
  app.listen(PORT, () => {
    console.log(`db: ${dbKind}`);
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("startup failed:", err);
  process.exit(1);
});
