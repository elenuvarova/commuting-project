# Commuting Experience — UX Project Brief

> Source: HEC UX course, Module 4 — "The Commuting Experience". Pedagogy adapted from
> the Hasso Plattner Institute / Stanford d.school design-thinking exercise. ~2-hour,
> fast-paced run through a full UX cycle: **research → ideation → prototyping → testing.**

This file is the source-of-truth study of the assignment. Downstream deliverables and
the prototype trace back to it.

---

## 1. The exercise in one line

Reinvent the daily **commuting experience** via a mobile solution, using a *user-centered,
empathic* approach — interview a real user, find an insight, ideate, prototype, test, iterate.

The module deliberately starts with a "false start" (draw your best idea from nothing in 4
min) to demonstrate why designers should **not** start from their own assumptions. That first
sketch is kept and compared at the end against the user-grounded solution.

## 2. The UX cycle — phases, timings, deliverables

| # | Phase | Time | Deliverable |
|---|-------|------|-------------|
| 0 | False start — draw best idea from nothing | 4 min | A sketch (kept for end comparison) |
| 1 | Write interview guide | 5 min | 6-part guide (below) |
| 2 | Interview a real user | 10 min | Field notes |
| 3 | Analyze (user takes a 20–25 min break) | 20–25 min | Insight + Madlib summary |
| 4 | Choose stakeholder + frame brainstorm | 5 min | "How might we…?" question |
| 5 | Brainstorm / Crazy-8 | 8 min | ≥8 drawn ideas, 1/min |
| 6 | Present ideas to user, collect feedback | 5–10 min | Reaction notes (no defending!) |
| 7 | Converge | 5 min | One synthesized concept |
| 8 | Low-fi interactive prototype (Marvel POP) | 10 min | Clickable paper prototype |
| 9 | Re-test with user, iterate | — | What works / doesn't list |
| — | (High-fi / wireframes — out of scope, named only) | — | — |

### Interview guide — the 6 parts
1. **Intro / rapport** — greet, introduce yourself, explain the goal.
2. **Their commuting experience** — typical path; best & worst experiences; why.
3. **Clarification** — 2–3 questions to sharpen understanding of points that stood out.
4. **Emotional depth** — go beyond facts; surface feelings & impressions. Probe with
   "Why are you saying this?", "Tell me more about that." Even a good commute has friction.
5. **Urban survival kit** — what they carry: how many bags, weight, the tech they always have.
6. **Reassure** — do NOT ask what features they want (that's the designer's job). The user is
   the expert of their *experience*; you are the expert of *design*.

### Analysis fill-in-the-blanks (Step 3)
- "It is interesting / surprising that he/she ______."
- "The thing that looks most important to him/her is ______."
- Insight (educated intuition, Kahneman 2002): "I'm wondering if this means that ______."
- **Madlib summary:** "_[user]_ needs a solution for _[need]_ because _[insight]_."

### Brainstorm framing (Step 4)
Pick a **stakeholder/sponsor** (public-transit org, car maker, hospital logistics, etc.) and
commit to it. Then:
> "How might we, as _[organization]_, take advantage of _[insight]_ to deliver _[need]_?"

### Low-fi prototype tests (Step 8)
1. **Sequence** — right order of actions/info; anything missing between key steps?
2. **Vocabulary / mental model** — do words & images match how the user thinks about commuting?
3. **Interaction** — is it liked? usable? fun?

## 3. Worked example (the course's reference user — Mario)

Provided in full as a model (not to copy verbatim):
- **Who:** Student, lives in Saint-Léonard, commutes to school. Alternates **car vs public
  transit** — parking near school is hard (2-hour zones); takes the car when lazy.
- **Survival kit:** Oversized headphones in a beauty/protective case — the *central* commute
  item. "If they're not charged, I'll take my car" (to listen to music). Gym bag, school bag, lunch.
- **On the commute:** Reads articles, people-watches, phone (playlists, messages, email). A
  "flow" of *general* (not specific) thoughts that makes transit **bearable**.
- **Pain / emotion:** Stress about being **on time**. "Existential dread" of routine —
  "Groundhog Day", "what am I doing?". Worst commute = a nightmare (unreported construction +
  rain + no parking, late for a stressful oral presentation).
- **Insight (Annemarie):** Get from A→B **on time**, with the **least anxiety** and the most
  "**bubble / head space**". Car↔transit alternation isn't good-cop/bad-cop — it's a *cycle* to
  counterbalance the dread of sameness. Efficient, but in a gentle/nourishing way.
- **HMW direction → concept:** Heart-rate-based, light, "don't-make-me-think" experience as a
  **Fitbit add-on**: solo "light play" (music/heart-rate, "zen") + collaborative/social mode
  (heart-rate "tug-of-war" with close friends; music synced to pace). Reference med-fi prototype
  built in Adobe XD in <3 hrs (single function, swipe/catch gesture).

## 4. Final submission (the graded artifact)

A **≤3-minute video** covering, in order:
1. Introduce the persona.
2. Main insights from the interview.
3. The "How might we…?" question the brainstorm answers.
4. Which ideas were retained, what the user said, justify the choice.
5. Sketch of the final concept + explanation.
6. Low-fi prototype + user's comments.

Plus a **one-sentence** summary (user profile + essence of project), upload to YouTube, and a
**peer evaluation** of 4 peers on *relevance, innovation, clarity* (~50-word justifications).

---

## 5. How we execute this (Elena's 3 goals: do the UX · save context · build a working prototype)

The course assumes (a) a **real human interview** and (b) a **paper** prototype. Elena wants the
UX done end-to-end **and a real working app prototype**. Adaptation:

- **Research-grounded persona.** Since no live interview is run by the assistant, we ground the
  persona, behaviors, and pain points in **domain research** (see step below) and label them as
  research-synthesized — we do **not** fabricate a real interview.
  - *Most course-faithful path (recommended):* Elena conducts the real 10-min interview with a
    friend (the course's core requirement) and hands over notes; the assistant does everything
    else (analysis, HMW, ideation, concept, prototype, video). Research below is useful either way.
- **Working prototype escalates the paper step.** The converged concept becomes a real
  **React + Vite + Express + Sequelize** app on the template in this repo — runnable locally,
  deployable free on Render.
- **Concept is TBD by research.** We do not pre-commit to the course's heart-rate idea; the
  opportunity should fall out of the research + insight.

### Decisions (confirmed 2026-06-09)
- **Language:** all deliverables in **English only** (persona, video script, in-app copy).
- **Persona:** **fully research-synthesized** (no live interview). In the video this is presented
  honestly as a research-based persona, not a real interview.
- **The persona — Alex:**
  - 37 years old.
  - **Lives in Antwerp**, commutes to an **office in Brussels several times a week**.
  - **Hybrid worker:** works from home most days → an *irregular*, non-daily commute (a key
    differentiator from the always-commuting Mario).
  - **The commute itself:** the classic **Antwerp ↔ Brussels intercity** trip — ~45 km. Either
    NMBS/SNCB train (Antwerpen-Centraal ↔ Brussel-Centraal/Noord/Zuid, ~40–50 min) or car on the
    **E19** (heavy congestion). This is one of Belgium's busiest rail/road corridors.
  - Everything downstream (insights, HMW, concept, prototype) is built around Alex.

### Persona tailoring — extra context to layer on top of the generic research
When the main research lands, do a focused supplementary pass on: (a) the **Antwerp ↔ Brussels**
commute specifically (NMBS/SNCB intercity trains — frequency, delays, crowding, the Antwerp-Brussels
corridor; E19 car congestion; park-and-ride; season tickets) and (b) **hybrid/remote-worker**
commute patterns (is-it-worth-going-in friction, schedule irregularity, re-adapting to commuting
after WFH days, coordinating office days). These sharpen Alex beyond the generic findings.

### Research brief (running now)
Commuting pain points & emotions across modes (car, transit, cycling, walking); existing
app landscape & gaps (transit/nav, audio/music/podcast, productivity, wellness); commuter
segments & behaviors incl. the "urban survival kit" and the role of audio/headphones; emerging
solution patterns (biometrics/heart-rate, gamification, music synced to pace, mindfulness,
social commuting); and evidence on what actually reduces commute stress & improves wellbeing.
