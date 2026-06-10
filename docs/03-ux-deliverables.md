# UX Deliverables — "The Commuting Experience" (persona: Alex)

> Everything here traces to [docs/commuting-ux-brief.md](commuting-ux-brief.md) (the assignment) and
> [docs/02-research-findings.md](02-research-findings.md) (the evidence). The persona is
> **research-synthesized**, not a live interview — presented honestly as such (see §2).

---

## 1. Persona — Alex

**Alex, 37 — hybrid product manager. Lives in Antwerp (Berchem), office in Brussels.**

- **Commute:** Goes in **2–3 days/week** (usually Tue–Thu, but it shifts). Takes the **NMBS IC train**
  Antwerpen-Berchem → Brussel-Centraal, **~40–45 min**. Drives the **E19** only when he's running late or
  hauling things — and resents the congestion, ~€25/day parking and the LEZ.
- **Urban survival kit:** phone, **noise-cancelling headphones** (his "bubble"), laptop backpack, reusable
  coffee cup, the **SNCB app** with a Flex ticket.
- **A typical office morning:** The night before / over breakfast he runs the same loop — *"Is it even
  worth going in today? Who's actually in? What's the first meeting?"* Checks the SNCB app, sees the 8:42 is
  fine, leaves, then the train is 7 min late and packed (since the 4→3/hour cut). He answers Slack on his
  phone, half-watches the window, and arrives at his 09:30 standup still feeling like he's "catching up,"
  not switched-on.
- **WFH days:** No commute at all — work bleeds straight into the kitchen; he ends the day without ever
  having "left work."
- **Pains (evidence-mapped):**
  1. **Uncertainty, not distance.** Delays, cancellations, *skipped stops*, and crowding make the trip feel
     out of his control — and *perceived control is the single strongest predictor of commute stress.*
  2. **The irregular rhythm.** Because it's only 2–3×/week he forgets the timetable, mistimes departures,
     and burns energy on the "should I go in" decision — *"paradox management fatigue."*
  3. **No clean boundary.** Hybrid work stripped away the commute-as-transition; he arrives un-ramped and
     gets home un-decompressed. *Losing the commute's "liminal space" raises burnout risk.*
- **Goals / needs:** feel **in control** of an unpredictable trip; **arrive calm and mentally ready**
  (switched-on for work, switched-off for home); make the occasional trip feel **worth it**.
- **Quote (composite, illustrative):** *"It's only 40 minutes — that's not the problem. The problem is I
  never know how those 40 minutes are going to go, and lately I get to my desk already frazzled."*

## 2. Interview guide (the instrument)

> The 6-part canvas the course prescribes — written as if to interview Alex. (Since no live interview was
> run, the "answers" in §3 are synthesized from research, not transcribed. Recommended: Elena can run this
> guide with a real hybrid commuter in 10 min and the rest of the deliverable still holds.)

1. **Intro / rapport** — "Thanks for doing this. It's about the commuting experience — there are no wrong
   answers, I just want to understand your trips. Mind if I take notes?"
2. **Their commute** — "Walk me through a typical office day, door to door. Which days do you go in, and how?
   Tell me about your best commute ever — and your worst. What made each one that way?"
3. **Clarification** — "You mentioned the train was packed — how often is that? When you say you 'check the
   app', what are you actually looking for? On WFH days, what's different?"
4. **Emotional depth** — "How do you *feel* by the time you sit down at your desk? …Why do you say that?
   Tell me more about that. Is there a moment in the trip that flips your mood one way or the other?"
5. **Urban survival kit** — "What's always in your bag? What can't you commute without? When do the
   headphones go on — and what happens on a day they're dead?"
6. **Reassure (no solutioning)** — *Do not* ask what features he wants. Keep him the expert of his
   experience; the design is our job.

## 3. Analysis — insights

Filling the course's blanks, grounded in §1–§2 and the research:

- **"It is surprising that Alex…"** is stressed far less by the 40 minutes themselves than by *not knowing
  how the trip will unfold* — and that on his WFH days he actually *misses* the commute as a boundary.
- **"The thing that looks most important to Alex is…"** feeling **in control** of an unpredictable trip and
  **arriving in the right headspace** — switched-on for work, switched-off for home.
- **Insight — "I'm wondering if this means that…"** for a hybrid worker the commute isn't just transport;
  it's the **only reliable ritual that separates home-Alex from work-Alex** — and its *irregularity* is
  exactly what breaks both his sense of control and that ritual.

**Madlib summary:**
> **Alex needs** a way to feel *in control* of his irregular train commute **and** to use the ride as a
> deliberate *home↔work mental transition*, **because** his stress comes from **uncertainty (not distance)**
> and hybrid work has removed the boundary the daily commute used to give him.

## 4. Stakeholder + "How might we?"

**Sponsor chosen: NMBS/SNCB (Belgian Railways).** Best-placed of all options: they *own the real-time data*
that drives the uncertainty, they have a *direct interest* in commute satisfaction (public transport scores
lowest of all modes and they're losing trips to the car), and they already sell a **Flex** product and run
an **app with 1M+ users** aimed exactly at hybrid commuters.

> **How might we, as NMBS/SNCB, take advantage of the fact that Alex's stress comes from uncertainty (not
> the 40 minutes) and that the ride is a wasted home↔work transition — to deliver a commute where he feels
> in control and arrives mentally ready?**

## 5. Brainstorm — Crazy-8

Eight ideas, one per minute, mode-aware (each line = the sketch you'd draw):

1. **Go / No-go card** — one morning screen: who's in the office, in-person meetings, weather, live line
   status → *"Worth going in. Leave by 8:18 for the 8:42."* (kills the "should I go in" loop)
2. **Honest arrival confidence** — not the inflated 90% punctuality but a personal *"92% you make your 09:30
   standup,"* with delay/skip/crowd risk shown and a **backup train pre-picked.** (restores control)
3. **Crowd radar** — which departures/carriages are likely full (the 4→3 cut); *"board car 3, it's
   emptier."* (targets *felt* crowding = personal-space proximity)
4. **"Switch On" session** — a guided audio matched to the *actual* 40-min ride: set 3 intentions → rehearse
   the day's role → focus music. Arrive ramped-up. (role-clarifying prospection)
5. **"Switch Off" session** — the evening ride: close today's loops → park tomorrow's top task → decompress
   audio. Arrive home as home-Alex. (shutdown ritual / boundary)
6. **"Fake commute" for WFH days** — a 12-min walk + the same Switch On/Off to restore the lost boundary.
7. **Ticket co-pilot** — *"You've gone in 9 days this month — a Flex 10 with the 70.48% employer refund
   beats pay-per-trip by €X."* (kills the irregular-commuter ticket-math pain)
8. **Disruption auto-reframe** — on a delay/cancellation: re-route **and** *"you've got 12 extra min — bank
   it as a longer Switch-Off, or clear your top email?"* (turns lost control into a coping moment — the
   hinge that joins the two halves)

## 6. Feedback round (evidence-projected, labelled)

> No live user, so this is an **evidence-projected** reception keyed to the research segment — *not* a real
> quote. Recommended: Elena does a 5-min reaction check with one hybrid commuter to make this authentic.

- **Strongest resonance — #1 Go/No-go, #2 Arrival confidence, #4/#5 Switch On/Off.** They hit the two
  highest-evidence levers (perceived control; guided role-transition) and the #1 hybrid pain ("should I go
  in"). Expect *"this is exactly the part I dread."*
- **Liked but secondary — #3 Crowd radar** (loved, but data-availability-dependent), **#7 Ticket co-pilot**
  (practical, "yes please," but a utility not the heart), **#8 Disruption reframe** (the clever bit people
  remember).
- **Lukewarm — #6 Fake commute** (nice-to-have; risks feeling gimmicky; park for v2).
- **Likely pushback:** "don't make me do a meditation" → the transition must feel **light and optional**,
  not a wellness chore (matches the research: keep it low-effort, not a demanding task).

## 7. Converged concept — **"Threshold"**

**Threshold — a commute companion (positioned as an NMBS/SNCB companion) for hybrid workers that turns the
irregular train trip into something you control and arrive *ready* from.** Two linked modes, joined by the
disruption-reframe hinge:

- **PLAN (before / at the station):** Go/No-go decision support + **honest arrival confidence** + crowd- and
  disruption-aware departure pick + ticket co-pilot. → *restores perceived control* (lever #1).
- **TRANSITION (on the train):** a **journey-length-matched** *Switch On* (morning: 3 intentions → role
  rehearsal → focus) or *Switch Off* (evening: close loops → park tomorrow → decompress). → *restores the
  home↔work boundary* (lever #2).
- **The hinge:** when a delay/skip/cancellation hits, Threshold re-routes **and** offers to **bank the lost
  time** as transition — converting the moment of lost control into the coping moment.

**Why it wins:** it sits exactly in the documented **white space** — *no app links uncertainty-reduction
with a guided home↔work transition.* Transit apps show the trigger but don't help you cope; mindfulness apps
help you cope but ignore the trigger and aren't trip-aware. Threshold bridges them, for the commuter (hybrid)
whose transition cue is otherwise broken.

**Tagline:** *"Know you'll make it. Arrive ready."*

**Scope honesty:** the strongest *evidence* is for restoring **perceived/felt** control and a guided
transition — so Threshold promises *"feel in control, arrive ready,"* **not** a measured biometric/heart-rate
drop (reappraisal moves felt stress, not physiological markers — see findings caveat). This is a deliberate
move *away* from the course's heart-rate example toward the evidence.

## 8. Low-fi prototype → working prototype

**Low-fi (course step, Marvel POP):** 4 paper screens — (1) *Today* Go/No-go + leave-by, (2) *Arrival
confidence* + backup train, (3) *Transition* picker (Switch On/Off) with a 40-min timer, (4) *Session*
step-by-step. Tappable hotspots: Today → confidence → start transition → finish → home.

**Working prototype (what we actually build on the template):** the two-screen core loop —
1. **Today / Plan:** the chosen Antwerp→Brussels train with a (mocked) **live status**, *leave-by* time,
   **arrival-confidence %**, crowd hint, and a pre-picked backup.
2. **Transition:** pick **Switch On / Switch Off**, a **journey-length timer** (default 40 min) that walks
   the guided steps; the session + the day's **3 intentions** persist to the DB (Sequelize), with a short
   **history** of past transitions.

Built on the repo's React + Vite + Express + Sequelize template — runnable locally (SQLite), deployed as a
Docker container on a self-hosted Coolify server (Postgres). Spec/build tracked separately.

## 9. Final video script (≤3 min, English)

> Format tip: PowerPoint → Record Slideshow, or screen-record the working prototype. ~430 words ≈ 2:50.

**[0:00–0:25] Persona.** "Meet Alex — 37, a hybrid product manager who lives in Antwerp and goes into a
Brussels office two or three days a week, by train. It's a 40-minute ride — and on paper, no big deal."

**[0:25–1:00] Insights.** "But research on commuting and my analysis of Alex point somewhere surprising. His
stress doesn't come from the 40 minutes — it comes from *uncertainty*: delays, skipped stops, packed trains
since the service was cut. Perceived control is the single biggest predictor of commute stress. And because
he's *hybrid*, the trip is irregular — so he's also lost the one ritual that used to separate home-Alex from
work-Alex. He arrives frazzled, and gets home without ever switching off."

**[1:00–1:20] How might we.** "So: *How might we, as Belgian Railways, take Alex's real problem — uncertainty,
and a wasted home-to-work transition — and give him a commute where he feels in control and arrives ready?*"

**[1:20–2:00] Ideas + reception.** "I brainstormed eight ideas — a go/no-go morning card, honest arrival
confidence with a backup train, a crowd radar, guided 'Switch On' and 'Switch Off' sessions timed to the
ride, a ticket co-pilot, and a disruption auto-reframe. The ones that landed hardest were the two that hit
the evidence dead-on: telling Alex he'll *make it*, and using the ride itself to switch on and off."

**[2:00–2:35] Concept.** "Those converge into **Threshold** — a companion to the railway app with two modes.
**Plan**: before he leaves, an honest 'you'll make your 9 o'clock' plus a backup — that's the control.
**Transition**: on the train, a 40-minute guided 'Switch On' in the morning and 'Switch Off' at night — three
intentions, then focus; or close the loops, then decompress. And when a delay hits, it banks the lost time
*into* the transition instead of into stress."

**[2:35–3:00] Prototype + close.** "Here's the working prototype — Today tells him he'll make it; one tap
starts a 40-minute Switch-On that saves his three intentions. It sits in a real gap: transit apps show the
problem, wellness apps ignore it — Threshold is the one that does both. *Know you'll make it. Arrive ready.*"

## 10. One-sentence summary (for the submission box)

> **Threshold** helps **Alex — a 37-year-old hybrid worker commuting Antwerp→Brussels by train** — *feel in
> control of an unpredictable trip and use the ride as a guided home↔work mental transition,* because his
> stress comes from uncertainty, not distance, and hybrid work erased the boundary the commute used to give him.
