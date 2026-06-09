import { useEffect, useRef, useState } from "react";

const STEPS = {
  switch_on: [
    { title: "Land", body: "You’re on board. One slow breath. The trip is handled — your only job now is to arrive ready." },
    { title: "Set 3 intentions", body: "What are the 1–3 things that would make today a win?", input: "intentions" },
    { title: "Rehearse your first moment", body: "Picture your 09:30 standup. What’s your one opening line?", input: "note" },
    { title: "Focus", body: "Headphones on. The rest of the ride is yours — we’ll nudge you 3 min before Brussel-Centraal." },
  ],
  switch_off: [
    { title: "Close the loops", body: "What did you actually get done today? Name it and let it count." },
    { title: "Park tomorrow’s top task", body: "Write the one thing to start with tomorrow — then it’s out of your head.", input: "note" },
    { title: "Decompress", body: "Work stays on the train. Three breaths. You’re heading home." },
    { title: "Arrive home", body: "Berchem coming up. You’re off the clock — home-mode from here." },
  ],
};
const DURATIONS = [
  { label: "40 min", min: 40, sec: 2400 },
  { label: "50 min", min: 50, sec: 3000 },
  { label: "Demo · 20s", min: 1, sec: 20 },
];
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function TransitionScreen({ handoff }) {
  const [type, setType] = useState(handoff.type);
  const [duration, setDuration] = useState(DURATIONS.find((d) => d.min === handoff.durationMin) || DURATIONS[0]);
  const [phase, setPhase] = useState("setup");
  const [stepIndex, setStepIndex] = useState(0);
  const [intentions, setIntentions] = useState(["", "", ""]);
  const [note, setNote] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(duration.sec);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const steps = STEPS[type];
  const isOn = type === "switch_on";

  const loadHistory = () =>
    fetch("/api/sessions").then((r) => (r.ok ? r.json() : [])).then(setHistory).catch(() => setHistory([]));

  useEffect(() => { loadHistory(); }, []);
  useEffect(() => {
    if (phase !== "running") return;
    intervalRef.current = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  function begin() { setStepIndex(0); setSecondsLeft(duration.sec); setPhase("running"); }
  function reset() { setPhase("setup"); setStepIndex(0); setIntentions(["", "", ""]); setNote(""); setSecondsLeft(duration.sec); }

  async function finish() {
    setSaving(true); setSaveError(null);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type, durationMin: duration.min,
          intentions: isOn ? intentions.filter((i) => i.trim()) : [],
          note: note.trim() || null, completed: true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      clearInterval(intervalRef.current);
      setPhase("done"); loadHistory();
    } catch (err) { setSaveError(err); } finally { setSaving(false); }
  }

  return (
    <>
      <div className="section-label">Transition · {isOn ? "home → work" : "work → home"}</div>

      <div className="phase-view" key={phase}>
      {phase === "setup" && (
        <>
          <div className="mode-row">
            <button className={isOn ? "mode active" : "mode"} aria-pressed={isOn} onClick={() => setType("switch_on")}>
              <span className="ic">☀️</span><span className="t">Switch-On</span><span className="s">Morning · ramp into work</span>
            </button>
            <button className={!isOn ? "mode active" : "mode"} aria-pressed={!isOn} onClick={() => setType("switch_off")}>
              <span className="ic">🌙</span><span className="t">Switch-Off</span><span className="s">Evening · decompress</span>
            </button>
          </div>
          <p className="muted" style={{ fontSize: 15 }}>Matched to your ride — pick a length:</p>
          <div className="chips">
            {DURATIONS.map((d) => (
              <button key={d.label} className={d.label === duration.label ? "chip active" : "chip"} aria-pressed={d.label === duration.label} onClick={() => setDuration(d)}>
                {d.label}
              </button>
            ))}
          </div>
          <div className="spacer" />
          <button className="btn primary" onClick={begin}>Begin {isOn ? "Switch-On" : "Switch-Off"} · {duration.label}</button>
        </>
      )}

      {phase === "running" && (
        <>
          <div className="timer-wrap">
            <div className="timer-glow" />
            <div className="timer">{fmt(secondsLeft)}</div>
            <div className="timer-sub">{secondsLeft === 0 ? "time’s up — finish when ready" : "remaining"}</div>
          </div>
          <div className="progress"><div className="bar" style={{ width: `${100 - (secondsLeft / duration.sec) * 100}%` }} /></div>
          <div className="card step">
            <div className="count">Step {stepIndex + 1} of {steps.length}</div>
            <h3>{steps[stepIndex].title}</h3>
            <p>{steps[stepIndex].body}</p>
            {steps[stepIndex].input === "intentions" && (
              <div className="fields">
                {intentions.map((val, i) => (
                  <input key={i} placeholder={`Intention ${i + 1}`} value={val}
                    onChange={(e) => { const n = [...intentions]; n[i] = e.target.value; setIntentions(n); }} />
                ))}
              </div>
            )}
            {steps[stepIndex].input === "note" && (
              <div className="fields">
                <textarea rows={2} placeholder={isOn ? "Your opening line…" : "Tomorrow’s first task…"}
                  value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            )}
          </div>
          {saveError && <p className="error">Couldn’t save: {saveError.message}</p>}
          <div className="spacer" />
          <div className="btn-row">
            <button className="btn" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => i - 1)}>Back</button>
            {stepIndex < steps.length - 1 && secondsLeft > 0
              ? <button className="btn primary" onClick={() => setStepIndex((i) => i + 1)}>Next</button>
              : <button className="btn primary" onClick={finish} disabled={saving}>{saving ? "Saving…" : "Finish & save"}</button>}
          </div>
        </>
      )}

      {phase === "done" && (
        <div className="card done-card">
          <div className="badge">✓</div>
          <h3>{isOn ? "You’re switched on." : "You’re switched off."}</h3>
          <p>{isOn ? "Arrive as work-mode. Saved to your transitions." : "Work stays on the train. Saved to your transitions."}</p>
          <button className="btn" onClick={reset}>Done</button>
        </div>
      )}
      </div>

      <div className="section-label" style={{ marginTop: 8 }}>Past transitions</div>
      {history.length === 0 && <p className="muted" style={{ fontSize: 13 }}>No transitions yet — finish one above.</p>}
      {history.map((h) => (
        <div key={h.id} className="history-item">
          <span className={h.type === "switch_on" ? "pill on" : "pill off"}>{h.type === "switch_on" ? "Switch-On" : "Switch-Off"}</span>
          <span className="dur">{h.durationMin} min</span>
          {Array.isArray(h.intentions) && h.intentions.length > 0 && <span className="det">· {h.intentions.join(" · ")}</span>}
          {h.note && <span className="det">· {h.note}</span>}
        </div>
      ))}
    </>
  );
}
