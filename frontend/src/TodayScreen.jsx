import { useEffect, useState } from "react";

const RING_R = 40;
const RING_C = 2 * Math.PI * RING_R;

function Ring({ pct }) {
  const r = RING_R, c = RING_C;
  const color = pct >= 0.85 ? "var(--success)" : pct >= 0.7 ? "var(--warning)" : "var(--danger)";
  const [offset, setOffset] = useState(c);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = c * (1 - pct);
    if (reduce) { setOffset(target); setShown(Math.round(pct * 100)); return; }
    const id = setTimeout(() => setOffset(target), 60);
    let raf, start;
    const tick = (now) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / 1100);
      setShown(Math.round(pct * 100 * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); };
  }, [pct]);

  return (
    <div className="ring">
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="8" />
        <circle
          className="prog" cx="46" cy="46" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <div className="pct">{shown}%</div>
    </div>
  );
}

export default function TodayScreen({ onStartTransition }) {
  const [disrupt, setDisrupt] = useState(false);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/today${disrupt ? "?disrupt=1" : ""}`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setPlan).catch(setError).finally(() => setLoading(false));
  }, [disrupt]);

  if (loading) return <p className="muted">Checking your line…</p>;
  if (error) return <p className="error">Couldn’t load your plan: {error.message}</p>;
  if (!plan) return null;

  const delayed = plan.status === "delayed";

  return (
    <>
      <div className="section-label">Plan · restore control</div>

      <div className={delayed ? "card delayed" : "card"}>
        <p className="headline">{plan.headline}</p>

        <div className="confidence">
          <Ring pct={plan.arrivalConfidence} />
          <div className="label">
            <strong>Arrival confidence</strong>
            <span>honest odds you make {plan.firstCommitment}</span>
          </div>
        </div>

        <hr className="divider" />

        <div className="trip">
          <dl className="leave">
            <dt>Leave by</dt>
            <dd>{plan.leaveBy}</dd>
          </dl>
          <div className="train">
            <div className="t">{plan.train}{delayed ? ` · +${plan.delayMin}` : ""}</div>
            <div className="s">{plan.scheduledDeparture} → {plan.scheduledArrival} · pl. {plan.platform}</div>
          </div>
        </div>

        <p className="crowd">🚆 {plan.crowd} · {plan.crowdHint}</p>

        <div className="chip-info">
          Backup pre-picked · <strong>{plan.backup.train}</strong> {plan.backup.scheduledDeparture} → {plan.backup.scheduledArrival}
        </div>

        {plan.reframe && (
          <div className="reframe">
            <strong>{plan.reframe.message}</strong>
            <span>{plan.reframe.suggestion}</span>
            <button className="btn ghost" onClick={() => onStartTransition({ type: "switch_on", durationMin: 50 })}>
              Bank the 12 min → longer Switch-On
            </button>
          </div>
        )}
      </div>

      <button className="btn primary" onClick={() => onStartTransition({ type: "switch_on", durationMin: 40 })}>
        Start Switch-On for this ride
      </button>

      <label className="toggle">
        <input type="checkbox" checked={disrupt} onChange={(e) => setDisrupt(e.target.checked)} />
        Simulate a delay
      </label>
    </>
  );
}
