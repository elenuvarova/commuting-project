import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, dbKind } from "./db.js";
import { TransitionSession } from "./models.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "ok", db: dbKind });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
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
    const sessions = await TransitionSession.findAll({
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.post("/api/sessions", async (req, res) => {
  try {
    const { type, durationMin, intentions, note, completed } = req.body;
    if (type !== "switch_on" && type !== "switch_off") {
      return res.status(400).json({ status: "error", message: "type must be switch_on or switch_off" });
    }
    const session = await TransitionSession.create({
      type,
      durationMin: Number.isFinite(durationMin) ? durationMin : 40,
      intentions: Array.isArray(intentions) ? intentions : [],
      note: typeof note === "string" ? note : null,
      completed: Boolean(completed),
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

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

start();
