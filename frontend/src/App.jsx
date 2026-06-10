import { useState } from "react";
import TodayScreen from "./TodayScreen.jsx";
import TransitionScreen from "./TransitionScreen.jsx";
import { Icon } from "./icons.jsx";

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
      <div className="icons">
        <Icon name="cellularbars" size={12} color="text" />
        <Icon name="wifi" size={12} color="text" />
        <Icon name="battery" size={13} color="text" />
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
            <button className="btn sm primary" onClick={() => applyTourStep(0)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              <Icon name="play-fill" size={13} color="white" />Take the tour
            </button>
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
              <button className="btn sm primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => (tourStep < TOUR.length - 1 ? applyTourStep(tourStep + 1) : setTourStep(null))}>
                {tourStep < TOUR.length - 1 ? <><span>Next</span><Icon name="chevron-right" size={11} color="white" /></> : "Done"}
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
