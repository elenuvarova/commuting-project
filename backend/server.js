import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { sequelize, dbKind } from "./db.js";
import { TransitionSession } from "./models.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);
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
      headline: "Heads up — IC 1832 is +12 min. You'll still make your standup with the backup.",
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
    const sessions = await TransitionSession.findAll({ order: [["createdAt", "DESC"]], limit: 20 });
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
  app.use(express.static(path.join(__dirname, "public")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

async function start() {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`db: ${dbKind}`);
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("startup failed:", err);
  process.exit(1);
});
