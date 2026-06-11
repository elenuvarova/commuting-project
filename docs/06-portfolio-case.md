# 🚆 Threshold — a calmer hybrid commute

> *Source draft for the Notion portfolio case (Projects DB). Built in the same template as the Chroma / SVP / HoppIT cases — header block · table of contents · numbered sections · appendix. Screenshots are added LAST, after the audit-driven edits. Placeholders marked 📸.*

---

## Header block (two columns)

**Left column — blockquote:**

> 🚆 **Project** · Threshold — turning an irregular Antwerp→Brussels train commute into something you *control* and arrive *ready* from
> **Discipline** · UX research · product design · design system · prototyping — a full *research → concept → system → working app* UX case
> **Status** · Live demo ([commute-app.ontwrpn.com](https://commute-app.ontwrpn.com)) + a token-driven Figma design system (3 modes)
> **My role** · Solo, end-to-end — research synthesis, persona, concept, design system, and the React + Express prototype
> **Context** · **HEC Montréal — "The Commuting Experience" UX course project (Sept–Oct 2025)**, run with the Stanford d.school method (which deliberately starts from a "false start")
> **Timeline** · Sept–Oct 2025
> **Tools** · Figma · React + Vite · Express + Sequelize · Docker / Coolify
>
> This is the reasoning behind **Threshold**: an evidence-led read of what actually makes a hybrid commute stressful, the insight that fell out of it, and the concept, design system and working prototype that answer it — framed as a companion to the NMBS/SNCB railway app.

**Right column — "At a glance" callout + hero:**

> ⚡ **At a glance**
> **Domain** · Public transport · hybrid commuting · B2C companion app
> **User** · Alex, 37 — hybrid product manager, Antwerp ↔ Brussels by train, 2–3×/week
> **Sponsor (framing)** · NMBS/SNCB (Belgian Railways)
> **Evidence** · 9 peer-reviewed studies + a verified corridor & hybrid-pattern pass
> **Key lever** · *Perceived control* — the single strongest predictor of commute stress
> **Concept** · **Plan** (restore control) + **Transition** (restore the home↔work boundary), joined by a disruption-reframe hinge
> **Tagline** · *"Know you'll make it. Arrive ready."*

📸 *Hero: Today screen (live app) — arrival-confidence ring + leave-by, in the iPhone frame.*

`<table_of_contents>`

---

# 1. Executive Summary

**Threshold** reframes the hybrid commute. For someone who goes into the office two or three days a week, the pain of the trip isn't the 40 minutes — it's the **uncertainty** (delays, skipped stops, crowding) and the **lost home↔work boundary** that hybrid work quietly removed. I took the HEC Montréal "Commuting Experience" brief through a full user-centred cycle — research, persona, insight, ideation, prototype — and deliberately let the concept *emerge from the evidence* rather than from the obvious idea the brief nudged toward (a heart-rate "game").

The evidence pointed somewhere specific: **perceived control is the single most powerful predictor of commute stress**, and the commute is a **role transition** that, used deliberately, turns a chore into a benefit. Threshold answers both with two linked modes — **Plan** (honest arrival-confidence + a pre-picked backup train = control) and **Transition** (a journey-length *Switch-On / Switch-Off* = the mental boundary) — joined by a **disruption-reframe** that banks lost time *into* the transition instead of into stress.

The output is three connected layers: a **research-backed concept**, a **token-driven Figma design system** (one set of screens that renders as wireframe, light, or dark by switching a variable mode), and a **working React + Express prototype**, deployed and hardened.

> 🎓 *What this case adds beyond the assignment:* a fact-checked evidence base (9 peer-reviewed studies, 24/25 claims verified by adversarial checking), the Antwerp↔Brussels corridor reality (the Dec-2024 4→3 trains/hour cut; the "89.7% punctuality" that hides skipped stops), and a real shipped prototype — not a paper mock.

---

# 2. The Brief & Method

The assignment: **reinvent the daily commuting experience via a mobile solution, using a user-centred approach** — research a real user, find an insight, ideate, prototype, test, and land a ≤3-minute video. The HEC Montréal exercise (Stanford d.school) deliberately opens with a **"false start"**: you're invited to design from your own assumptions first, precisely so the method can prove *why you shouldn't.*

I took that seriously. Two honest adaptations, stated up front:

- **The persona is research-synthesised, not a live interview.** Rather than fabricate a transcript, I grounded "Alex" in peer-reviewed commuting research plus a focused pass on the Antwerp↔Brussels corridor and hybrid-work patterns. The interview guide is included (§3) so the same instrument can be run with a real commuter in ten minutes.
- **The concept was *not* pre-decided.** It had to fall out of the evidence — and it did, *away* from the course's own reference example (a heart-rate game), because the evidence doesn't support biometrics as the success signal (§4).

---

# 3. Who we're designing for — Alex

> 🧑‍💻 **Alex, 37 — hybrid product manager.** Lives in Antwerp (Berchem), office in Brussels. Goes in **2–3 days/week** (usually Tue–Thu, but it shifts) on the **NMBS IC train** Antwerpen-Berchem → Brussel-Centraal, **~40–45 min**; drives the E19 only when late or hauling things. Survival kit: phone, **noise-cancelling headphones** (his "bubble"), laptop backpack, the **SNCB app** with a Flex ticket.

**A typical office morning.** The night before he runs the same loop — *"Is it even worth going in today? Who's actually in? What's the first meeting?"* He checks the app, sees the 8:42 is fine, leaves — and the train is seven minutes late and packed (since the 4→3/hour cut). He answers Slack on his phone, half-watches the window, and arrives at his 09:30 standup still feeling like he's "catching up," not switched-on. On WFH days there's no commute at all — work bleeds straight into the kitchen and he never really "leaves."

**Pains (evidence-mapped):**

| Pain | What's really going on |
|---|---|
| **Uncertainty, not distance** | Delays, cancellations, *skipped stops* and crowding make the trip feel out of his control — and *perceived control is the single strongest predictor of commute stress.* |
| **The irregular rhythm** | Only 2–3×/week, so he forgets the timetable, mistimes departures, and burns energy on the "should I go in" decision — *paradox-management fatigue.* |
| **No clean boundary** | Hybrid work stripped away the commute-as-transition; he arrives un-ramped and gets home un-decompressed — *losing the commute's "liminal space" raises burnout risk.* |

> *"It's only 40 minutes — that's not the problem. The problem is I never know how those 40 minutes are going to go, and lately I get to my desk already frazzled."* — composite, illustrative

---

# 4. Research — what the evidence says

A multi-source, fact-checked pass: **25 sources, 111 claims, 24/25 verified by 3-vote adversarial checking** (peer-reviewed transport & organisational-psychology studies, 2007–2026), plus a focused pass on the corridor, hybrid-worker patterns, and the app landscape.

## 4.1 The core findings

| Finding | So what for design |
|---|---|
| **Perceived control** is the single most powerful predictor of commute stress; cognitive appraisal is *trainable*. *(Chatterjee 2020; De Reuver & Biron 2024)* | Reduce uncertainty and restore a *felt* sense of control — the #1 lever. |
| The commute is a **home↔work role transition**; using it for "role-clarifying prospection" turns a chore into a benefit. *(Jachimowicz et al. 2021, Organization Science, n=1,736)* | Guide a deliberate mental switch-on / switch-off — the evidence base for "headspace". |
| Stressors are **mode-specific**; felt crowding is about *immediate personal space*, not overall density. *(Legrain 2015; Evans & Wener 2007)* | Tailor to the train; reduce *experienced* crowding (emptier-car nudges, audio withdrawal). |
| Reappraisal reliably reduces **subjective** stress but **not** physiological markers. *(research caveat)* | Promise "feel in control, arrive ready" — **not** a biometric/heart-rate drop. |
| **Gap:** transit apps surface uncertainty but offer no coping; mindfulness apps reframe but ignore the trigger and aren't trip-aware. | The white space: link uncertainty-reduction **with** a guided home↔work transition. |

## 4.2 The corridor is real, and it's getting harder

- **~41 km; IC ~39–44 min** via Berchem/Mechelen.
- **Dec 2024: NMBS cut the corridor from 4 → 3 trains/hour** — remaining trains so full that riders are "left behind on platforms every day." Crowding is now a daily reality, not an edge case.
- **"89.7% punctuality" (2024) hides the felt reality:** "on time" means *under 6 minutes late* and **excludes cancellations and skipped stops** — the ombudsperson found trains skipping stops **~5×/day** (900+ in six months). *The official number is not the felt reliability.*
- **The right ticket for a 2–3×/week commuter is a Flex 10** (buy travel days, used flexibly; statutory **70.48% employer contribution** since Feb 2026), not a monthly.

## 4.3 The pivot (the method working as intended)

> ⚠️ The course's reference example used a heart-rate "game." The evidence says that's shaky — interventions move *felt* stress, not biometrics. So Threshold steers deliberately toward **control + role-transition**, not biometrics. This is the "false start" paying off: the obvious idea was the wrong one.

---

# 5. Insight & "How might we"

> **Alex needs** to feel *in control* of an unpredictable train commute **and** to use the ride as a deliberate *home↔work transition*, **because** his stress comes from uncertainty (not distance) and hybrid work removed the boundary the daily commute used to give him.

**Sponsor: NMBS/SNCB.** Best-placed of all options — they *own the real-time data* that drives the uncertainty, they have a direct interest in commute satisfaction (public transport scores lowest of all modes and they're losing trips to the car), and they already sell **Flex** and run an **app with 1M+ users** aimed at exactly this commuter.

> **How might we, as NMBS/SNCB, take the real problem — uncertainty and a wasted home→work transition — and give Alex a commute where he feels in control and arrives ready?**

---

# 6. Ideation → the concept

Eight quick ideas (Crazy-8), each mode-aware: ① go/no-go morning card · ② honest arrival-confidence + backup train · ③ crowd radar · ④ guided **Switch-On** · ⑤ **Switch-Off** · ⑥ "fake commute" for WFH days · ⑦ ticket co-pilot · ⑧ disruption auto-reframe.

The ideas that hit the evidence hardest — **②, ④, ⑤**, with **⑧** as the clever connective tissue — converged into **Threshold**:

| | |
|---|---|
| 🎯 **Plan — restore control** | Honest *arrival-confidence* ("92% you make your 09:30 standup"), a pre-picked backup train, and a crowd hint — *before* you leave. |
| 🌗 **Transition — restore the boundary** | A journey-length **Switch-On** (set 3 intentions → role rehearsal → focus) or **Switch-Off** (close loops → park tomorrow → decompress). Arrive as work-self; come home as home-self. |

**The hinge:** when a delay hits, Threshold re-routes **and** offers to **bank the lost time** into a longer transition — turning the moment of lost control into the coping moment.

---

# 7. The concept — Threshold

**Threshold is a commute companion for hybrid workers** (positioned as an NMBS/SNCB companion) that turns the irregular train trip into something you control and arrive *ready* from.

**Why it wins:** it sits exactly in the documented **white space** — *no app links uncertainty-reduction with a guided home↔work transition.* Transit apps show the trigger but don't help you cope; mindfulness apps help you cope but ignore the trigger and aren't trip-aware. Threshold bridges them, for the commuter (hybrid) whose transition cue is otherwise broken.

> **Scope honesty.** The strongest evidence is for restoring **felt** control and a guided transition — so Threshold promises *"feel in control, arrive ready,"* **not** a measured heart-rate drop. A conscious move away from the course's biometric example toward what the evidence supports.

📸 *Today on-time · Today delay + reframe — side by side.*

---

# 8. Design system

A professional, token-driven system in Figma, built so **one set of screens serves both wireframes and finished UI** by switching a variable **mode** — a genuine single source of truth (verified: the web app and the Figma file share the same `var(--token)` names and SF Pro type).

- **Tokens:** `Primitives` + `Spacing` + `Theme` (16 semantic colours) across **3 modes — Wireframe · Light · Dark**. Code syntax (`var(--token)`) set on every variable; screen fills/strokes are variable-bound (no hardcoded values).
- **Wireframe mode** uses a neutral grey palette; **Light / Dark** are the finished UI (sky-blue + violet accents; a confidence ring that's teal when confident, amber when uncertain, red when not).
- **Type:** an **SF Pro** iOS ramp (Display → Caption / Overline), so the prototype reads as native iPhone.
- **Components:** StatusBar, HomeIndicator, SegmentedTabs, Button, Chip, Pill, TextField — plus ConfidenceRing, PlanCard, ModeCard, ReframeCard, InfoChip, HistoryItem and an inline-SVG **SF Symbols** icon set — all bound to tokens.
- **Screens:** 5 (Today on-time · Today delay + reframe · Transition setup · running · done) on **402×874** iPhone frames, shown in all three modes by switching one mode.

📸 *Foundations (tokens × 3 modes + SF Pro ramp) · UI Dark · Wireframes.*

---

# 9. The working prototype

Beyond the paper step, the converged concept is a **real running app** (React + Vite + Express + Sequelize):

- **Today / Plan** — the chosen Antwerp→Brussels train with a (mocked) live status, *leave-by* time, an animated **arrival-confidence** ring, a crowd hint, a pre-picked backup, and the **delay reframe** that offers to bank lost minutes into a longer Switch-On.
- **Transition** — pick **Switch-On / Switch-Off**, a **journey-length timer** that walks the guided steps; the session and the day's **3 intentions** persist (Sequelize), with a short **history** of past transitions.

It's **live at [commute-app.ontwrpn.com](https://commute-app.ontwrpn.com)** (Docker on a self-hosted Coolify server; SQLite local / Postgres prod), with motion design throughout that respects `prefers-reduced-motion`. All icons are real Apple **SF Symbols** as inline SVG (no raster), routed through one Icon component.

> 🛡️ **Quality.** The build passed a code review and an OWASP-oriented security audit, then a full multi-dimension UX/UI/accessibility/HIG/performance audit — input validation & size caps, rate limiting, security headers (CSP/HSTS), accessible focus order and labels, and `prefers-reduced-motion` support.

📸 *Today (live) · Transition Switch-On setup (live).*

---

# 10. Process & Reflection

## 10.1 What worked
- **Letting the evidence drive the concept.** The user-centred method pushed the design *away* from the obvious (a heart-rate game) toward the well-evidenced levers — control and a guided role-transition. That's the whole point of the "false start."
- **One source of truth.** The design-system-with-modes meant wireframes and hi-fi never drifted — they're the *same* screens, one variable switch apart; and the deployed web app shares the same token names.
- **Shipping a real prototype**, not a paper mock — the concept is something you can actually use, on a phone, today.

## 10.2 What I'd do differently
- **Run the interview guide with a real hybrid commuter** (10 minutes) and a 5-user reaction test on the concept — the persona and reception are evidence-grounded but desk-based.
- **Wire real NMBS data** behind the mocked Today plan.
- **Add per-user accounts** so transition history persists across devices, and **ship the Light theme** to the web app (the Figma has it; the deployed demo is dark-only).

## 10.3 Next
A live reaction test · real-time line data · a Light-theme web pass · accounts for cross-device history.

---

# Appendix

## A. Sources (peer-reviewed / primary)
Chatterjee et al. 2020 (*Transport Reviews*); Liu, Ettema & Helbich 2022 (*J. Transport & Health*); De Reuver & Biron 2024 (*J. Transport & Health*); Jachimowicz et al. 2021 (*Organization Science*); Legrain et al. 2015 (*J. Transport Geography*); Evans & Wener 2007 (*J. Environmental Psychology*); Loo & Tsoi 2024 (*Transportation Research A*); Sarmiento-Suarez et al. 2026 (*Frontiers in Sociology*); Ma et al. 2024 (*Int. J. Epidemiology*). Corridor & hybrid context: Omio; Brussels Morning; newmobility.news; SNCB; Microsoft Work Trend Index 2022; Owl Labs 2024; The Conversation 2025 (Drake Univ.); Psychology Today 2023.

## B. Glossary
- **Perceived control** — a commuter's felt sense of agency over the trip; the strongest single predictor of commute stress.
- **Role transition** — the psychological shift between home-self and work-self; the commute is its natural cue.
- **Role-clarifying prospection** — deliberately rehearsing the upcoming work role during the commute (the evidence base for "Switch-On").
- **Flex ticket** — NMBS's pay-per-travel-day product, built for 2–3×/week hybrid commuters.
- **Design tokens / variable modes** — named design values (colour, spacing, type) that render differently per mode (wireframe / light / dark) from one source.
- **HIG** — Apple's Human Interface Guidelines.

## C. Artefacts
- Live demo — [commute-app.ontwrpn.com](https://commute-app.ontwrpn.com)
- Figma design system — *Threshold* (token-driven, 3 modes)
- Repo — `elenuvarova/commuting-project` (React + Vite · Express + Sequelize · Docker)
