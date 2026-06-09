import { useState } from "react";
import TodayScreen from "./TodayScreen.jsx";
import TransitionScreen from "./TransitionScreen.jsx";

const TOUR = [
  { view: "today", disrupt: false, eyebrow: "Step 1 · Plan", title: "Know you’ll make it",
    body: "Honest arrival confidence — not the inflated punctuality number — plus a pre-picked backup train and a crowd hint, before you leave." },
  { view: "today", disrupt: true, eyebrow: "Step 2 · A delay hits", title: "Stay in control",
    body: "Confidence drops to a calm 74%, the backup is ready, and Threshold offers to bank the 12 lost minutes into a longer Switch-On." },
  { view: "transition", disrupt: false, eyebrow: "Step 3 · Switch-On", title: "Ramp into work",
    body: "On the train, set the 1–3 intentions that make today a win — a guided home → work transition." },
  { view: "transition", disrupt: false, eyebrow: "Step 4 · Arrive ready", title: "…and Switch-Off",
    body: "A timer matched to the ride guides the transition; in the evening, Switch-Off closes the loops. Arrive ready; come home off-the-clock." },
];

function StatusBar() {
  return (
    <div className="statusbar">
      <span className="time">9:41</span>
      <div className="island" />
      <div className="icons" style={{ color: "var(--text)" }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
          <path d="M8.5 2.2c2.6 0 5 1 6.8 2.7l-1.5 1.6A7.5 7.5 0 0 0 8.5 6 7.5 7.5 0 0 0 3.2 6.5L1.7 4.9A9.7 9.7 0 0 1 8.5 2.2zm0 3.6c1.6 0 3 .6 4.1 1.6l-1.6 1.7c-.6-.6-1.5-1-2.5-1s-1.9.4-2.5 1L4.4 7.4A6 6 0 0 1 8.5 5.8zm0 3.5c.7 0 1.3.3 1.8.8L8.5 12 6.7 10c.5-.5 1.1-.8 1.8-.8z" />
        </svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor" />
          <rect x="24" y="4" width="1.5" height="5" rx="0.75" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("today");
  const [handoff, setHandoff] = useState({ type: "switch_on", durationMin: 40 });
  const [disrupt, setDisrupt] = useState(false);
  const [tourStep, setTourStep] = useState(null);

  function startTransition(next) {
    setHandoff({ type: next.type ?? "switch_on", durationMin: next.durationMin ?? 40 });
    setView("transition");
  }

  function applyTourStep(i) {
    const s = TOUR[i];
    setView(s.view);
    setDisrupt(s.disrupt);
    setTourStep(i);
  }

  return (
    <div className="stage">
      <aside className="about-panel">
        {tourStep === null ? (
          <>
            <h2>Threshold</h2>
            <p className="lede">
              A commute companion for hybrid workers — feel in control of an unpredictable train,
              and use the ride as a home↔work mental switch.
            </p>
            <button className="btn sm primary" onClick={() => applyTourStep(0)}>▶ Take the tour</button>
          </>
        ) : (
          <div className="about-card">
            <div className="eyebrow">{TOUR[tourStep].eyebrow}</div>
            <h3>{TOUR[tourStep].title}</h3>
            <p>{TOUR[tourStep].body}</p>
            <div className="tour-dots">{TOUR.map((_, i) => <i key={i} className={i === tourStep ? "on" : ""} />)}</div>
            <div className="tour-nav">
              <button className="btn sm" onClick={() => (tourStep === 0 ? setTourStep(null) : applyTourStep(tourStep - 1))}>
                {tourStep === 0 ? "Exit" : "Back"}
              </button>
              <button className="btn sm primary" onClick={() => (tourStep < TOUR.length - 1 ? applyTourStep(tourStep + 1) : setTourStep(null))}>
                {tourStep < TOUR.length - 1 ? "Next" : "Done"}
              </button>
            </div>
          </div>
        )}
      </aside>

      <div className="phone">
        <div className="screen">
          <StatusBar />
          <div className="app-body">
            <header className="brand">
              <h1>Threshold</h1>
              <div className="tagline">Know you’ll make it. Arrive ready.</div>
            </header>
            <div className="tabs">
              <button className={view === "today" ? "active" : ""} aria-pressed={view === "today"} onClick={() => setView("today")}>
                Today
              </button>
              <button className={view === "transition" ? "active" : ""} aria-pressed={view === "transition"} onClick={() => setView("transition")}>
                Transition
              </button>
            </div>
            <div className="screen-view" key={view}>
              {view === "today"
                ? <TodayScreen onStartTransition={startTransition} disrupt={disrupt} />
                : <TransitionScreen handoff={handoff} />}
            </div>
          </div>
          <div className="home-indicator" />
        </div>
      </div>

      <aside className="demo-panel">
        <div className="demo-label">Prototype controls</div>
        <label className="toggle">
          <input type="checkbox" checked={disrupt} onChange={(e) => setDisrupt(e.target.checked)} />
          Simulate a delay
        </label>
        <p className="demo-hint">
          Flips the Today plan to a delayed train, with a reframe that banks the lost time into a longer Switch-On.
        </p>
      </aside>
    </div>
  );
}
