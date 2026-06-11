# Threshold — Audit Report

*Commute companion app (React + Express prototype) and its Threshold Figma design system. HEC Montréal UX exercise.*

**Date:** 2026-06-12 · **Scope:** frontend (`frontend/src`), backend (`backend/`), Dockerfile, and the Threshold Figma file `aJRy71rHbxzfzXQ5qQf6h6`, across Apple HIG / iOS 26, WCAG 2.2 AA, responsive layout, React robustness, backend security, performance, and design-system consistency.

## Executive summary

Threshold is in good health for a portfolio prototype. There are **zero Critical** issues and the foundations are genuinely strong: a single token system shared verbatim with Figma, an SF Pro type stack, `dvh` units, 17px inputs that dodge iOS auto-zoom, an `AbortController`-guarded fetch, `prefers-reduced-motion` handling, server-side input validation, rate limiting, and a tight Helmet CSP. The work that matters clusters around **two themes**. First and most important: **state and data handling in the core Today ↔ Transition flow** — a single accidental tab tap silently destroys an in-progress Switch-On (typed intentions, notes, and the running timer), and a related remount/handoff pattern makes that loss unavoidable on re-entry. Second: **touch ergonomics** — the primary segmented tabs and several other controls render at ~33px, under Apple's 44pt floor, and one backend endpoint serves everyone's personal intentions and notes from a single unauthenticated global list. None of these are catastrophic for a demo, but the state-loss bug and the sub-44pt primary nav are the two things a reviewer would hit first.

> **Source-of-truth alignment is real — credit where due.** The deployed web app and the Threshold Figma file are **one** design system, not divergent surfaces. Verified from both sides: the radius tokens (`--r-sm:12 / --r-md:16 / --r-lg:20 / --r-pill:999`) and the full semantic colour set (`color/bg`, `color/surface-2`, `color/primary`, `color/success`, …) match name-for-name and value-for-value, and both lead with the SF Pro stack. The web `:root` *is* the Figma Dark mode verbatim. An earlier "gold / Inter / serif" scare came from an **unrelated film-app file** that happened to be open in Figma desktop — it is **not** the Threshold system and was correctly ignored. There is no token divergence to fix. The real headline is the top web finding below: **switching tabs mid-Transition silently destroys the in-progress session.**

## Counts

| Severity | Web | Figma / design system | Total |
|----------|----:|----------------------:|------:|
| Critical | 0 | 0 | 0 |
| High | 3 | 0 | 3 |
| Medium | 11 | 0 | 11 |
| Low | 18 | 6 | 24 |
| **Total** | **32** | **6** | **38** |

*Findings tagged "both" are filed under the area where their fix lives. The six "Figma / design system" Lows are the token-parity, type-scale, raw-radius, Light-mode, and source-of-truth credit notes.*

---

## Web findings

### UX flow, states, and edge cases

#### HIGH — Switching tabs mid-Transition silently destroys the entire in-progress session
- **Location:** `frontend/src/App.jsx:97` (`key={view}` + ternary :98-100) · `frontend/src/TransitionScreen.jsx:28-35`
- **Issue:** `App` renders `<div className="screen-view" key={view}>` with a ternary that mounts **only one** screen at a time. Every piece of run state — `phase`, `secondsLeft`, `stepIndex`, the typed `intentions` array, and the `note` — lives in `TransitionScreen`'s local `useState`. Tapping the Today/Transition tabs unmounts `TransitionScreen` (the ternary drops it from the tree) and tapping back mounts a fresh instance, resetting everything. The running interval is torn down on unmount (`:58`) and never resumes. There is no `localStorage`/`sessionStorage` (grep found none).
- **Evidence:** Repro — begin a Switch-On, advance to "Set 3 intentions", type "ship the deck" / "call Sam", tap **Today**, tap **Transition**: phase is back to `setup`, both intentions gone, timer reset to 40:00, `stepIndex` 0. No warning, no confirm, no recovery.
- **Fix:** (a) Lift the in-progress transition state into `App` so it survives, or (c) persist working state to `sessionStorage` and rehydrate on mount. **Note:** simply removing `key={view}` is *insufficient* — the ternary still unmounts the screen; you must keep both screens mounted (render both, hide one via CSS) **or** lift the state.
- **Effort:** M

#### MEDIUM — `key={view}` remounts TransitionScreen on every tab switch (React-robustness view of the above)
- **Location:** `frontend/src/App.jsx:97`
- **Issue:** Same defect from the code-robustness angle. The view container keys on a value that toggles back and forth, so React tears down and rebuilds `TransitionScreen`, wiping its timer and inputs and snapping to `setup`. **Root-cause nuance:** the loss is driven by the conditional ternary (the screen leaves the tree when `view !== "transition"`), not by the key alone — the key only controls whether the `viewEnter` CSS animation (`styles.css:329`) replays.
- **Evidence:** `App.jsx:97` wraps `view === "today" ? <TodayScreen/> : <TransitionScreen/>`; `TransitionScreen.jsx:28-35` holds all state in `useState`; the interval is component-scoped (`:51`).
- **Fix:** Render both screens and toggle visibility (`hidden`/`display:none`) so `TransitionScreen` stays mounted, or lift its state up; if the enter animation must replay, drive it with a transient class on a stable key rather than a remount.
- **Effort:** M

#### MEDIUM — Timer hitting 0:00 strands the user on a middle step
- **Location:** `frontend/src/TransitionScreen.jsx:142-144`
- **Issue:** The forward button is `stepIndex < steps.length - 1 && secondsLeft > 0 ? <Next> : <Finish & save>`. The `&& secondsLeft > 0` clause means the instant the countdown hits 0, Next is replaced by Finish **regardless of step**. Switch-On has 4 steps; if the timer expires on step 1 or 2 there is no longer any way to reach steps 3-4. Back still works, so the user can only move backward — a soft dead-end. The timer-sub even reads "time's up — finish when ready" (`:116`), implying finishing is optional while the UI has removed the only path forward.
- **Evidence:** `switch_on` steps length 4 (`:5-10`); the "Demo · 20s" duration (`:21`) makes this trivial to trigger. The interval (`:49-59`) only decrements `secondsLeft` — it never advances the step or auto-finishes.
- **Fix:** Drop `&& secondsLeft > 0` so Next stays available while `stepIndex < steps.length - 1` (the ternary already shows Finish on the last step), and add an always-available secondary Finish once time is up.
- **Effort:** S

#### MEDIUM — Re-entering Transition from Today resets a running session (every handoff is a new object)
- **Location:** `frontend/src/App.jsx:37-40` (`startTransition`) · `frontend/src/TransitionScreen.jsx:45-48` (effect on `[handoff]`)
- **Issue:** `startTransition` always builds a fresh `{ type, durationMin }` literal, even when values are identical. The effect keyed on `[handoff]` fires on every new reference and unconditionally resets `phase`/`stepIndex`/`secondsLeft`. So tapping "Start Switch-On" (40) or "Bank it" (50) from Today blows away an in-progress run even when the config didn't change. **Note:** the *dominant* cause of the loss is still the `key={view}` remount above — guarding this effect alone won't preserve the run; fix the remount first, then dedupe no-op handoffs.
- **Evidence:** `App.jsx:38` new object literal each call; `TransitionScreen.jsx:48` `[handoff]` dependency. Routes: `TodayScreen.jsx:109` (50) and `:116` (40).
- **Fix:** Keep `TransitionScreen` mounted / lift its state (per the High finding), then guard the reset against no-op handoffs (depend on primitive `type`/`durationMin`, skip while `phase === "running"`, optionally prompt "Restart this transition?").
- **Effort:** S

#### LOW — A Switch-On can be saved with zero intentions, producing a near-blank history row
- **Location:** `frontend/src/TransitionScreen.jsx:71`, `:165` · `backend/server.js:104-106`
- **Issue:** `finish()` sends `intentions: isOn ? intentions.filter(i => i.trim()) : []`. Advancing past the intentions step without typing (or an early Finish forced by the timer dead-end) saves an empty array. The backend accepts it; history renders the row but hides empty intentions (`:165` requires `length > 0`), so the saved "win" is just a pill + "40 min" with no content — the core value silently absent.
- **Evidence:** `:165` `Array.isArray(h.intentions) && h.intentions.length > 0`; nothing gates Finish on having an intention (`:144` disabled only while saving). Compounds with the timer dead-end.
- **Fix:** Require at least one non-empty intention before Finish on a Switch-On, **or** show an explicit "no intentions set" state in the saved row instead of a blank line.
- **Effort:** S

#### LOW — Switch-On copy promises a "3 min before Brussel-Centraal" nudge the prototype never delivers
- **Location:** `frontend/src/TransitionScreen.jsx:9`
- **Issue:** The final Focus step reads "Headphones on. The rest of the ride is yours — we'll nudge you 3 min before Brussel-Centraal." There is no Notification API, no scheduled nudge, no T-3min logic anywhere — the timer just counts to 0 and shows "time's up". The copy makes a behavioral promise the product doesn't keep.
- **Evidence:** Grep shows no Notification API / scheduler; the only time-based behavior is the `setInterval` countdown (`:49-59`) ending in the static "time's up — finish when ready" (`:116`).
- **Fix:** Soften the copy to describe the on-screen timer that actually exists, or wire the timer expiry to a visible in-app nudge state. Don't promise a push the demo can't show.
- **Effort:** S

#### LOW — Save-failure recovery works, but the retry path is implicit
- **Location:** `frontend/src/TransitionScreen.jsx:64-79`, `:138`, `:142-144`
- **Issue:** On a failed `POST /api/sessions`, `saveError` shows and the user correctly stays in `running` (typed data is preserved in state). But the visible action is still "Finish & save", undifferentiated from the original — there's no distinct Retry affordance and no hint that the data wasn't lost.
- **Evidence:** `setSaveError` set in catch (`:78`); phase flips to `done` only on success (`:77`); button at `:144` unchanged.
- **Fix:** When `saveError` is set, relabel the button "Try saving again" and add a one-line hint ("Your intentions are kept — tap to retry").
- **Effort:** S

#### LOW — Tour and the live phone share one `disrupt` state, so Step 2 desyncs from the manual delay toggle
- **Location:** `frontend/src/App.jsx:34-47`, `:108-111`
- **Issue:** The tour stepper and the "Simulate a delay" checkbox both write the same `disrupt` state, and the checkbox is `checked={disrupt}`. Running the tour visibly ticks/unticks the user's checkbox as steps advance (Step 2 sets it true, others false), and leaving the tour doesn't restore the user's prior choice.
- **Evidence:** Single `disrupt` state (`:34`); `applyTourStep` writes `setDisrupt(s.disrupt)` (`:45`); checkbox `onChange` also `setDisrupt` (`:110`).
- **Fix:** Scope the tour's disrupt to a derived value while `tourStep !== null`; honor the manual checkbox only when no tour runs, and restore the user's choice on exit. (This is an explicitly-labeled "Prototype controls" demo affordance, hence Low.)
- **Effort:** S

### Apple HIG & iOS 26 / touch targets

#### HIGH — Segmented tab buttons are ~33px tall — below the 44pt minimum tap target
- **Location:** `frontend/src/styles.css:126-132` · `frontend/src/App.jsx:90-95`
- **Issue:** The primary Today/Transition view switchers — hit constantly — render under Apple's 44pt floor. `padding: 8px 0` (16px) + a 14px font at `normal` line-height ≈ 32.8px.
- **Evidence:** Direct browser measurement (Playwright `getBoundingClientRect`) confirms **exactly 32.5px** tall. The `@media (max-width:460px)` full-screen branch adds no height, so they stay 32.5px on real phones too.
- **Fix:** `min-height: 44px` on `.tabs button` (or raise vertical padding to ~13px).
- **Effort:** S

#### MEDIUM — Duration chips are ~33px tall — below 44pt
- **Location:** `frontend/src/styles.css:271-276` · `frontend/src/TransitionScreen.jsx:99-104`
- **Issue:** The 40 / 50 / "Demo · 20s" pill chips on the primary setup path are ~33-35px (`padding: 8px 16px`, 14px font, +2px border). A ~10px shortfall on a primary control.
- **Evidence:** `styles.css:274` `padding: 8px 16px; font-size: 14px`; no `min-height`; `box-sizing:border-box`.
- **Fix:** `min-height: 44px` **plus** `display:inline-flex; align-items:center; justify-content:center` so the label stays centered (min-height alone top-aligns it), or simply bump vertical padding to ~13px.
- **Effort:** S

#### MEDIUM — "Simulate a delay" toggle has a ~16-20px tap target
- **Location:** `frontend/src/styles.css:203-207`, `:221` · `frontend/src/App.jsx:109-112`
- **Issue:** A native checkbox + a 14px-font label (`font-size:13px` base, overridden to 14px on the mobile pill) with no vertical padding, so the whole tappable `<label>` row is one line tall (~16-20px) — well under the 44pt floor / WCAG 2.5.5. On mobile this is the only interactive control in view.
- **Evidence:** `.toggle` (`:203-206`) is `display:flex; align-items:center; font-size:13px` with no `min-height`; `.toggle input` (`:207`) only sets `accent-color`, so the box stays native ~13-16px.
- **Fix:** `min-height:44px; align-items:center` on the `.toggle` label, and `width/height:22px` (+ padding) on the checkbox.
- **Effort:** S

#### MEDIUM — Full-screen mode paints a fake status bar (9:41) and fake home indicator over the real ones
- **Location:** `frontend/src/App.jsx:17-29`, `:103` · `frontend/src/styles.css:76-104`, `:386-391`
- **Issue:** The `<=460px` breakpoint runs edge-to-edge on a real phone but keeps the fake iOS chrome: it still renders the hardcoded "9:41", fake cellular/wifi/battery glyphs, and a fake 5px home indicator. On a real iPhone this double-draws over the OS's actual status bar and home indicator — two clocks, two home bars. The breakpoint hides only the Dynamic Island pill (`styles.css:390`).
- **Evidence:** `App.jsx:20` hardcodes `9:41`; `App.jsx:103` always renders `.home-indicator`; `styles.css:99-104` draws the 5px bar; `viewport-fit=cover` set with no `env(safe-area-inset-*)` anywhere in app CSS.
- **Fix:** In the `<=460px` block hide the entire fake chrome (`.statusbar, .home-indicator { display:none }`) so the real OS chrome shows through; keep the fake chrome only inside the `.phone` device frame (>460px).
- **Effort:** S

#### LOW — Full-screen mobile mode ignores safe-area insets despite `viewport-fit=cover`
- **Location:** `frontend/src/styles.css:386-391` · `frontend/index.html:5`
- **Issue:** `index.html` opts into `env(safe-area-inset-*)` via `viewport-fit=cover`, but no rule anywhere consumes those insets. In the `<=460px` branch the `.phone` goes full-screen, so the app's own decorative chrome sits under the real notch/home-indicator. Impact is cosmetic mis-alignment of *fake* system chrome — the real interactive UI lives in `.app-body` between the 54px statusbar and 26px home-indicator, so no tap targets land in the unsafe zone.
- **Evidence:** Grep for `env(` / `safe-area` across `frontend/src` + `index.html` returns zero matches; `index.html:5` = `viewport-fit=cover`; `.statusbar` 54px (`:76-86`), `.home-indicator` 26px (`:100`).
- **Fix:** Add `padding-top/bottom: env(safe-area-inset-top/bottom)` to `.screen` (or the `.phone` frame) inside the `<=460px` block so the whole simulated device is inset. (Don't pad `.statusbar` individually — it would double-count its existing 54px.)
- **Effort:** S

#### LOW — Tour-nav and "Take the tour" `.btn.sm` buttons are ~39px tall — below 44pt
- **Location:** `frontend/src/styles.css:237` · `frontend/src/App.jsx:59`, `:70-75`
- **Issue:** `.btn.sm` (Take the tour, Exit/Back, Next/Done) is ~38.8px (`padding:10px 14px`, 14px font, +2px inherited border). **Decisive mitigation:** these render only inside `.about-panel`, which is `display:none` except at `@media (min-width:1080px)` — i.e. a pointer-driven desktop layout. The 44pt floor is a *touch* guideline; for pointer input the relevant bars (WCAG 2.5.8 AA's 24px) are met. No real-world defect today, only a latent risk if `.btn.sm` is ever surfaced on touch.
- **Evidence:** `styles.css:237` `.btn.sm { padding:10px 14px; font-size:14px }`; `.about-panel { display:none }` (`:212`) shown only at `:239` (`min-width:1080px`).
- **Fix:** Add `min-height:44px` as cheap insurance, **or** document these as intentional desktop/pointer controls and flag for any future touch reuse.
- **Effort:** S

#### LOW — Liquid Glass material is on a prototype control but not on the iOS-style chrome
- **Location:** `frontend/src/styles.css:214-219` (`.demo-panel` backdrop-filter), `:122-132` (`.tabs` opaque), `:76-86` (`.statusbar` opaque)
- **Issue:** The only `backdrop-filter` in the codebase is on `.demo-panel` (the non-iOS case-study controls pill). The actual iOS-idiom chrome — segmented `.tabs` and `.statusbar` — is fully opaque. iOS 26's Liquid Glass would put the translucent material on the system chrome, not on a floating demo pill. **Caveat:** the documented design direction (`docs/04-design-system.md`) is a deliberate flat dark theme ("elevation by lightening surfaces + hairline borders"), and Liquid Glass is optional under HIG — so this is a stylistic enhancement against an intentional choice, not a defect.
- **Evidence:** `styles.css:218` `backdrop-filter: blur(10px)` only on `.demo-panel`; `.tabs` (`:124`) opaque `var(--surface-2)`; `.statusbar` inherits solid `--bg`.
- **Fix (optional):** Give `.tabs` a semi-transparent `surface-2` + `backdrop-filter: blur(~12-20px)` + a hairline top highlight. (Cosmetic; the "frost 6/20" figures cited in the original finding reference a kit-spec file that does not exist in the repo — treat as indicative only.)
- **Effort:** M

#### LOW — Ships dark-only; no `prefers-color-scheme: light` to honor the Figma Light mode
- **Location:** `frontend/src/styles.css:1-24` (dark `:root` only)
- **Issue:** The web ships only Dark and never responds to OS appearance; light-mode users get a dark UI. This is an opportunity, not a defect — the token plumbing makes a Light mode a CSS-variable swap, not a rebuild. (See the design-system section for the consolidated Light-mode parity note.)
- **Evidence:** Single `:root` with dark values; grep for `prefers-color-scheme` in `frontend/src` returns nothing; no `color-scheme` meta in `index.html`.
- **Fix:** Add `@media (prefers-color-scheme: light){ :root{ … } }` mapping the Figma Light values and set `<meta name="color-scheme" content="dark light">`. Keep token names identical; only values flip.
- **Effort:** M

### Responsive layout

#### MEDIUM — Landscape phone shows almost nothing — the full-screen branch is portrait-width-only
- **Location:** `frontend/src/styles.css:386` · `.phone:52-54`
- **Issue:** The only full-screen escape hatch is `@media (max-width:460px)`. A real phone in landscape reports width ~844 (> 460), so it stays in device-frame mode showing a 390×844 mock; at 844×390 only 390px is visible — **494px (59%) clipped** — and the `position:fixed` demo pill (`bottom:14px`) lands directly over the phone's body.
- **Evidence:** Reproduced at 844×390 via Playwright — phone `{h:844, top:40, bottom:884}`, `bottomCutOff 494`, `demo {top:342, bottom:376}`, `demoOverlapsPhoneBody: true`. The viewport meta gives no scaling rescue.
- **Fix:** Make the full-screen branch orientation/height-aware: key it on `(max-width:460px), (max-height:600px)` (the landscape height is 390px) and reuse the existing full-screen rules (`width:100%; height:100dvh; border-radius:0; hide island`).
- **Effort:** S

#### MEDIUM — Floating demo pill (the only out-of-phone control in the tablet band) has a 17px tap target, 13px checkbox
- **Location:** `frontend/src/styles.css:214-221` · `frontend/src/App.jsx:107-112`
- **Issue:** Between 461px and 1079px the side panels are `display:none` and "Simulate a delay" collapses to a fixed bottom pill. That pill is 35px tall, its `.toggle` label 17px, the native checkbox 13×13px — far under 44px. On an iPad portrait (768px, squarely in this band) it's a fiddly target. (The in-phone tabs and "Start Switch-On" are still interactive, so it's not the *only* control, but it is the only way to trigger the delay/disruption demo.)
- **Evidence:** Measured at 700×900 — pill `{h:35}`, `.toggle` `{w:128, h:17}`, checkbox `{w:13, h:13}`. The global `input{width:100%}` does **not** enlarge the checkbox (`appearance:auto`).
- **Fix:** In the narrow rule: `.demo-panel { padding:12px 18px; min-height:44px }`, `.demo-panel .toggle { min-height:44px; align-items:center }`, `.toggle input { width:22px; height:22px }`.
- **Effort:** S

#### LOW — In-phone tab buttons are 33px tall on real phones
- **Location:** `frontend/src/styles.css:126-131` · `frontend/src/App.jsx:89-96`
- **Issue:** The same Today/Transition tabs at 33px — under the 44pt HIG guideline but **passing** WCAG 2.5.8 AA (24px). The `max-width:460px` branch makes the 390px phone full-screen, so these are genuine on-device touch targets. Full-width (~159px) and well-spaced, so mis-tap risk is low; this is the AAA/HIG view of the High touch-target finding above.
- **Evidence:** Measured `{h:33, w:159}`; `padding:8px 0; font-size:14px`.
- **Fix:** `padding:12px 0; min-height:44px` (the container grows ~16px), optionally only inside the `max-width:460px` block.
- **Effort:** S

### WCAG 2.2 AA

#### MEDIUM — No custom keyboard focus indicator on any button
- **Location:** `frontend/src/styles.css` — `.tabs button` (l.126), `.btn` (l.186), `.mode` (l.258), `.chips .chip` (l.271), `.btn.sm` (l.237); only `input:focus` is styled (l.298)
- **Issue:** Every interactive element except the text inputs is a `<button>`, and none has a `:focus-visible` rule. The app overrides each button's entire appearance but defines no focus ring, so keyboard users fall back to the UA default outline — inconsistent and clip-prone on the near-black UI and rounded segmented containers. Inputs *do* get a deliberate focus treatment (border → `--primary`, 7.30:1), proving focus styling was considered for inputs but omitted for buttons. This is the WCAG 2.4.11 Focus Appearance (AA, WCAG 2.2) risk — a UA fallback ring exists, so it's a quality gap, not total absence.
- **Evidence:** Grep: the only `:focus` selector is `input:focus, textarea:focus` (l.298); zero `:focus-visible` rules anywhere.
- **Fix:** `.tabs button:focus-visible, .btn:focus-visible, .mode:focus-visible, .chips .chip:focus-visible, .toggle input:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }`. `--primary` #4aa3ff gives 7.30:1 on `--bg` and 5.80:1 on `--surface-2` — clears 3:1 everywhere; `outline-offset` keeps the ring off the pill/segment radius.
- **Effort:** S

#### LOW — Confidence ring value has a weak accessible name — "74%" reads with thin context
- **Location:** `frontend/src/TodayScreen.jsx:7-41` (Ring), rendered `:77`
- **Issue:** The ring's percentage is real text (`<div className="pct">{shown}%</div>`), so a screen reader *can* read it, and the contextual `.label` ("Arrival confidence / honest odds you make X") sits immediately adjacent in reading order — so it's weakly associated, not context-free. The SVG arc is decorative-redundant and fine unlabeled. During the count-up the text mutates 0→target with no `aria-live`, but that only fires when reduced-motion is **off** (correctly handled at `:14-16`).
- **Evidence:** Ring SVG circles (`:32-36`) unlabeled; `.pct` outputs `{shown}%`; `.label` is a sibling not linked via `aria-labelledby`; `shown` ramps via rAF (`:19-25`).
- **Fix:** On `.ring` add `role="img"` and `aria-label` computed from the **final** `pct` (not the animating `shown`), and `aria-hidden="true"` on `.pct` to avoid double-announcement.
- **Effort:** S

#### LOW — Neutral component boundaries (input, card, active tab) sit below 3:1
- **Location:** `frontend/src/styles.css` — `--border rgba(255,255,255,0.09)` (l.7), input border (l.294), `.card` border (l.142), active tab (l.132)
- **Issue:** WCAG 1.4.11 wants 3:1 for component boundaries needed to identify a control. The shared `--border` composites to ~1.24:1 on the input fill and the active-tab thumb is ~1.15:1 vs its track — so the input's resting boundary is genuinely hard to perceive until focused (the input fill vs its card is only ~1.10:1, making the border the sole cue). Mitigated for the tab by a 15:1 text-color swap + `aria-pressed`; the focused-input and active-chip/mode borders (`--primary`, 5.80-7.30:1) pass.
- **Evidence:** Recomputed: input border 1.24:1, active-tab thumb 1.15:1 — both far below 3:1.
- **Fix:** Raise the **form-control** resting border to ~3:1 — `rgba(255,255,255,0.35)` (≈3.18:1 on `--bg`), **not** 0.20 (only 1.81:1) — or give the active tab a subtle inset shadow in addition to the colour swap.
- **Effort:** S

#### LOW — Honest target-size report: all controls pass 2.5.8 AA (24px); tabs/chips/`.btn.sm` miss 2.5.5 AAA (44px)
- **Location:** `frontend/src/styles.css` — `.tabs button` (~33px), `.chips .chip` (~33px), `.btn.sm` (~39px)
- **Issue:** Every interactive control **passes** 2.5.8 Target Size (Minimum, AA = 24px); the demo checkbox is ~16px but its `<label>` wraps box + text, satisfying 2.5.8. The only shortfall is against the stricter 2.5.5 (AAA = 44px). Recorded for honesty so the tap-target items aren't double-counted as AA failures.
- **Evidence:** `.btn` (~52px) and `.mode` (~90px) clear 44px; tour-dots (7px) and status-bar icons (13px) are decorative/exempt.
- **Fix:** No AA action required. For AAA on a touch-first prototype, bump tabs to `padding:12px 0` and chips to `11px 16px`, or set `min-height:44px`.
- **Effort:** S

### Backend security + API robustness

#### HIGH — All users share one global, unauthenticated session list
- **Location:** `backend/server.js:86-94` (GET), `:96-121` (POST)
- **Issue:** No auth middleware and no per-user scoping anywhere. POST writes free-text intentions (5×200 chars) and a note (1000 chars) to a single global `TransitionSession` table; GET returns `findAll({ order:[['createdAt','DESC']], limit:20 })` with **no `where`/owner filter**. Any visitor to the deployed URL reads the 20 most recent sessions from **all** users — personal pre-commute intentions and notes — and can write entries into everyone's history. A genuine broken-access-control / IDOR-class bug. (Capped at 20 rows of mildly-personal demo data with no real identity attached — hence High, not Critical.)
- **Evidence:** GET handler has no `where`, no `req.user`, no token; `models.js:4-31` has no `userId`/`ownerId`; zero auth imports. Live at `commute-app.ontwrpn.com` with no auth gate.
- **Fix:** Minimum for a prototype — scope to an anonymous unguessable `ownerKey` (UUID in an httpOnly cookie): add an `ownerKey` column, set it on create, and add `where: { ownerKey }` to `findAll`. Better — real auth (auth-flow) issuing a `userId` and scoping every read/write. Until scoped, treat `/api/sessions` as publicly readable and stop writing anything personal.
- **Effort:** M

#### MEDIUM — Container runs as root — no `USER` directive in the Dockerfile
- **Location:** `Dockerfile:15-27` (stage 3 runtime)
- **Issue:** The runtime stage never drops privileges, so `node` and everything it runs execute as uid 0. A process-level RCE via a vulnerable transitive dep then owns the container filesystem as root. `node:20-alpine` ships a ready `node` user precisely to avoid this. (Defense-in-depth — only exploitable when chained with a separate RCE; no host bind-mounts in this Coolify deploy.)
- **Evidence:** `grep -in user Dockerfile` returns nothing; `CMD ["node","server.js"]` runs as root; `WORKDIR /app/backend` root-owned after COPY.
- **Fix:** Before EXPOSE/CMD: `RUN chown -R node:node /app` then `USER node`. PORT 3001 (>1024) binds fine as non-root; the chown keeps `./data.sqlite` writable.
- **Effort:** S

#### MEDIUM — SQLite is the default DB and is ephemeral in production
- **Location:** `backend/db.js:20-31`, Dockerfile (no volume), `backend/server.js:134`
- **Issue:** If `DATABASE_URL` is unset, `db.js` falls back to SQLite at `./data.sqlite` inside the container — wiped on every redeploy. The code warns ("data will not persist across deploys") but still starts and silently accepts writes that will vanish. No volume, no fail-fast guard. (Conditional misconfiguration of low-value demo data; the intended path sets `DATABASE_URL` → Postgres in Coolify, which never takes this branch.)
- **Evidence:** `db.js:24` warning then constructs SQLite anyway; Dockerfile has no VOLUME / mounted `SQLITE_PATH`.
- **Fix:** Fail fast in prod — `if (NODE_ENV==='production' && dbKind==='sqlite') { console.error(...); process.exit(1); }` — turning silent data loss into a loud startup failure. Given the global-sessions issue, requiring Postgres is the cleaner path.
- **Effort:** S

#### LOW — `sequelize.sync()` with no migrations is the production schema strategy
- **Location:** `backend/server.js:134`
- **Issue:** Schema is reconciled by bare `sequelize.sync()` at boot. Plain `sync()` never alters existing columns, so a future model change (e.g. the `ownerKey` column to fix the privacy bug) won't apply to an existing Postgres table — and `sync({alter:true})` is unsafe to run automatically against prod data. No migration tooling (no umzug / sequelize-cli, no `migrations/` dir). Latent, forward-looking — no present defect.
- **Evidence:** `server.js:134` `await sequelize.sync();`; `package.json` has no migration dep/script.
- **Fix:** Keep `sync()` for now but document that schema changes need a manual migration; introduce umzug / sequelize-cli before the first column change on deployed Postgres.
- **Effort:** M

#### LOW — No request logging and no compression on the Express app
- **Location:** `backend/server.js:14-31` (middleware), `backend/package.json:9-16`
- **Issue:** The stack is helmet + json + rate-limit only — no access logger (morgan/pino), so production has no record of who hit what, status codes, or latency (the rate limiter blocks but nothing logs blocked attempts), and no response compression. This is single-container (no nginx/reverse-proxy in the image), so the app is the only place to add these.
- **Evidence:** No morgan/pino/compression in deps; `express.static` (`:127`) serves the SPA uncompressed; only `console.error` on error paths.
- **Fix:** Add `pino-http` or `morgan('combined')` early in the stack and `compression()` before static/json. Logging is the higher-value of the two.
- **Effort:** S

#### LOW — `styleSrc 'unsafe-inline'` weakens the CSP — contained tradeoff
- **Location:** `backend/server.js:20`
- **Issue:** The CSP is otherwise tight (`scriptSrc 'self'`, `objectSrc 'none'`, `frameAncestors 'none'`, `baseUri 'self'`), but `styleSrc` allows `'unsafe-inline'`. Required today because the prototype uses inline `style={{…}}` attributes (including a dynamic progress-bar width). Not a defect — `scriptSrc` has no `'unsafe-inline'`, so script injection stays blocked and React auto-escaping leaves no obvious sink.
- **Evidence:** `server.js:20` `styleSrc: ["'self'", "'unsafe-inline'"]`; all other directives restrictive.
- **Fix (longer term):** Move static inline styles into the existing `styles.css`, convert the dynamic width to a CSS custom property, and drop `'unsafe-inline'` (or adopt nonce/hash-based styles).
- **Effort:** M

### Performance

#### LOW — No gzip/brotli compression — JS bundle ships at 167.8 KB instead of ~55 KB
- **Location:** `backend/server.js:30-31`, `:126-131`
- **Issue:** The Express server serves the SPA with no response compression (not a dependency, not wired in). The single JS bundle goes over the wire raw. (Mitigation: Coolify/Traefik *could* gzip at the proxy — not on by default, but one middleware away — and the surface is tiny and cacheable, so first-paint-only.)
- **Evidence:** Measured `frontend/dist/assets/index-oPYvncZe.js` = 167,829 B raw / 55,108 B gzip; CSS 12,426 B / 3,364 B gzip. ~180 KB → ~58 KB.
- **Fix:** `npm i compression` + `app.use(compression())` before the static handler. One line, ~120 KB saved.
- **Effort:** S

#### LOW — Static assets served with no `Cache-Control` — every revisit re-validates immutable files
- **Location:** `backend/server.js:127`
- **Issue:** `express.static` is called with no options, so serve-static emits `Cache-Control: public, max-age=0` — forcing a conditional GET / 304 round-trip on every navigation. The Vite assets are content-hashed (auto cache-busting), so they're safe to cache forever, but that's left on the table.
- **Evidence:** `dist/index.html` references hashed `/assets/index-*.js|css`; grep for `maxAge|Cache-Control|immutable` in app source = none.
- **Fix:** `app.use("/assets", express.static(".../public/assets", { maxAge: "1y", immutable: true }))` then a default `express.static(..., { maxAge: 0 })`; keep `index.html` uncached so deploys are picked up.
- **Effort:** S

#### LOW — `index.html` shipped uncompressed and revalidated on every SPA route
- **Location:** `backend/server.js:128-130`
- **Issue:** The catch-all SPA fallback sends `index.html` via `res.sendFile`, which (Express 4, `maxAge:0`) sets ETag/Last-Modified but no `Cache-Control` — so the shell is conditionally revalidated on every load. The dominant cost is the revalidation round-trip, not the 602 B of bytes; it gates discovery of the larger JS/CSS.
- **Evidence:** `dist/index.html` is 602 B; `sendFile` at `:129`; no compression / explicit cache headers.
- **Fix:** Serve `index.html` with `Cache-Control: no-cache` (revalidate, still allows a 304 fast-path); covered alongside the compression and static-cache fixes.
- **Effort:** S

#### LOW — GET /api/sessions has no `createdAt` index — negligible at limit 20 (premature to index)
- **Location:** `backend/server.js:88`, `backend/models.js:4-31`
- **Issue:** `findAll` orders by `createdAt DESC` with `limit 20` and the model defines no index, so on Postgres this is a full-table sort. At a few dozen rows it's sub-millisecond; an index would be pure overhead. Noted only so it isn't mistaken for a hot path.
- **Fix:** No action now. If sessions ever go high-volume/multi-user, add `indexes: [{ fields: ["createdAt"] }]` (and a `userId` filter).
- **Effort:** S

#### LOW — Per-second timer re-render and infinite CSS animations are correctly bounded (non-issue, recorded)
- **Location:** `frontend/src/TransitionScreen.jsx:49-59`, `frontend/src/styles.css:323-378`, `:381-383`
- **Issue:** Recorded with evidence so it isn't re-raised. The timer re-renders only `TransitionScreen`'s small subtree once/sec; the infinite `breathe` and `barberpole` animations are cheap (transform/opacity/background-position), exist only while `phase==='running'`, and are terminated under `prefers-reduced-motion` (`animation-iteration-count:1 !important`, `:382`). The Ring rAF also early-returns under reduced-motion.
- **Fix:** None needed. Micro-nit: the per-second `setSecondsLeft` re-renders the whole component including the Past-transitions list — irrelevant at ≤20 rows; memoize only if it ever grows.
- **Effort:** S

### Design-system consistency (web-side)

#### LOW — Icon "muted" color is not bound to the `--muted` token
- **Location:** `frontend/src/icons.jsx:20`
- **Issue:** The icon color map defines `muted` as a computed `color-mix(in srgb, var(--text) 55%, transparent)` ≈ rgb(135,138,143), while every CSS `.muted` text uses `var(--muted)` #9aa4b2 ≈ rgb(154,164,178). So a muted icon and the muted label beside it render two different greys (~40-unit delta) — `muted` is the lone non-tokenized entry in `COLOR`.
- **Evidence:** `icons.jsx:20` computed value; used at `TodayScreen.jsx:97` (tram icon) next to `.crowd` text styled `var(--muted)`; also `TransitionScreen.jsx:90/94` (sun/moon off state).
- **Fix:** Set `muted: 'var(--muted)'` so the icon grey matches the text grey.
- **Effort:** S

#### LOW — Two component radii hardcoded in px instead of `--r-*` tokens
- **Location:** `frontend/src/styles.css:128` (`.tabs button` 10px), `:228` (`.about-card` 18px), `:249` (wide `.demo-panel` 18px)
- **Issue:** Standard components use raw radii between the defined tokens (`--r-sm 12 / --r-md 16 / --r-lg 20`), so the corner language isn't fully token-driven and won't move if the scale is retuned. The wide `.demo-panel` hardcodes 18px while its base uses `var(--r-pill)` — an intra-component inconsistency. (The phone-frame radii 56/44/3px are real iPhone geometry and correctly left literal.)
- **Fix:** Map the tab button to `var(--r-sm)` (or add `--r-xs:10`), and the two 18px panels to `var(--r-lg)` or a new `--r-card` token. Keep device-frame radii literal.
- **Effort:** S

#### LOW — Inline font-size literals in JSX bypass the stylesheet
- **Location:** `frontend/src/TransitionScreen.jsx:98`, `:160`
- **Issue:** Two text sizes are set as raw inline `style` objects (`fontSize:15` on the "pick a length" helper, `fontSize:13` on the empty-state line) rather than via a class, duplicating values that appear many times in `styles.css` (13px ×10, 15px ×5) and putting type sizing where no token/class governs it. `.muted` carries only color, no size.
- **Fix:** Remove the inline style and use a class; add a small caption modifier (or a `--text-caption` token).
- **Effort:** S

#### LOW — Ad-hoc inline spacing numbers (5/6/7/8) for icon gaps, off the token grid
- **Location:** `App.jsx:59` (`gap:7`), `:73` (`gap:6`), `TodayScreen.jsx:97` (`marginRight:5`), `:105` (`gap:6`), `TransitionScreen.jsx:159` (`marginTop:8`)
- **Issue:** Icon-to-text gaps and small margins are hardcoded inline and inconsistent for the same visual relationship (two icon+label buttons use `gap:7` vs `gap:6`). There's no `--space-*` token scale, so these can't be unified today. (The real off-grid outliers are only `gap:7` and `marginRight:5`; 6 and 8 are already in-grid.)
- **Fix:** Add a shared flex `.icon-label` class with a single gap (settle on 6), and/or introduce a `--space-*` scale.
- **Effort:** S

---

## Figma / design-system findings

#### LOW — Web and Figma share ONE token system — genuine source of truth (CREDIT)
- **Location:** `frontend/src/styles.css` `:root` (l.2-24) ↔ Figma file `aJRy71rHbxzfzXQ5qQf6h6`
- **Strength:** Verified from both sides independently. Radius tokens match name+value (`radius/sm·12`, `radius/md·16`, `radius/lg·20`, `radius/pill·999`); the full semantic colour set (`color/bg`, `color/surface`, `color/surface-2`, `color/elevated`, `color/border`, `color/text`, `color/text-muted`, `color/primary`, `color/on-primary`, `color/accent`, `color/success`, `color/warning`, `color/danger`) maps one-to-one with the CSS vars; both lead with the SF Pro stack; the web `:root` is the Figma Dark mode verbatim (`#0b0f14 / #141a22 / #eceff4 / #4aa3ff`). The case-study claims (SF Pro, single source of truth, token-driven, Wireframe + Light + Dark modes) are **true**.
- **Note:** A `get_variable_defs` read during the audit returned a stray gold/Inter set — that was an **unrelated film-app file** open in Figma desktop and was correctly ignored. Figma also has an extra `radius/xl·28` with no CSS counterpart (extra in Figma, not a divergence).
- **Action:** No change needed. Keep crediting this alignment — it's verifiable.

#### LOW — Strengths confirmed: SF Pro stack, `dvh`, 17px inputs (no zoom), concentric-friendly radii (CREDIT)
- **Location:** `frontend/src/styles.css:22-23` (font), `:388` (100dvh), `:293` (input 17px), `:17-20` (radii)
- **Strength:** Four iOS 26 / HIG details are already correct: (1) the font stack leads with `-apple-system` / SF Pro; (2) mobile full-screen uses `100dvh` (not `vh`), surviving the dynamic URL/toolbar resize; (3) inputs/textareas are 17px — at/above the 16px threshold that prevents iOS auto-zoom-on-focus and matching the kit Body size; (4) the radius scale (12/16/20/999) supports concentric nesting (pill chips inside a 16px tab container).
- **Action:** No change required. Listed so these correct decisions aren't regressed during the tap-target/safe-area fixes.

#### LOW — No type-scale tokens in `:root` — 14 hardcoded font sizes despite a full Figma SF Pro ramp
- **Location:** `frontend/src/styles.css` `:root` (l.2-24) — color + radius tokens present, **no `--font-size-*`**
- **Issue:** The web exposes ~13 color tokens and 4 radius tokens but zero type-scale tokens, unlike the Figma file's named SF Pro ramp. Every font size is a raw px literal (14 distinct values: 11,12,13,14,15,16,17,18,20,22,24,28,32,64 across ~41 declarations), so nothing mirrors the Figma type ramp and the scale can drift silently. This is the one real token-parity gap. Pure maintainability — no functional/a11y/visual impact today.
- **Evidence:** `grep "font-size: var(--"` returns zero matches; e.g. `:118` h1 32px, `:282` `.timer` 64px, `:288` 11px overline.
- **Fix:** Add a `--text-*` / `--font-size-*` ramp to `:root` mirroring the Figma styles (e.g. overline 11 / caption 13 / body 15 / title 20 / display 64) and replace the 5-6 most-reused literals (13px ×10, 14px ×7, 15px ×5) with `var()`.
- **Effort:** M

#### LOW — Web ships Dark-only; Figma's Light mode is unreachable (parity opportunity)
- **Location:** `frontend/src/styles.css:1-24` — no `@media (prefers-color-scheme: light)` anywhere in `frontend/src`
- **Issue:** Figma maintains three modes on one variable collection; the deployed CSS exposes only Dark and contains zero `prefers-color-scheme` handling (grep returns only `min-width:1080px`, `prefers-reduced-motion`, `max-width:460px`). A light-OS user gets the `#0b0f14` dark UI. An opportunity, not a contrast defect — the dark palette is solid (`--text` 15.18:1, `--muted` 6.94:1, all comfortably AA), and the system already has the light tokens. **Evidence correction:** `color/success` does **not** flip between modes — per the repo's own design-system doc it aliases to `teal` (#34D399) in both Light and Dark; the "#047857" Light-success value cited in earlier notes appears nowhere in the repo. The genuine per-mode flip is on neutrals (e.g. `surface-2` #f0f2f5 Light vs #1e2630 Dark).
- **Fix:** Add `@media (prefers-color-scheme: light){ :root{ … } }` (or `[data-theme=light]`) re-defining the same `--token` values with the Figma Light neutrals — `--bg #F7F8FA`, `--surface #FFFFFF`, `--surface-2 #F0F2F5`, `--border #E3E7EC`, `--text ~#0B0F14`, `--muted #5B6470`, `--primary #0A84FF`; keep `success/warning/danger` unchanged. Components already consume `var(--token)`, so no component CSS changes.
- **Effort:** M

---

## Fix priority

Ordered by leverage (impact ÷ effort), highest first:

1. **Stop destroying the in-progress Transition on tab switch** — lift `TransitionScreen` state into `App` (or keep both screens mounted and hide one). Fixes the High data-loss bug *and* the `key={view}` remount and handoff-reset Mediums in one change. *(M)*
2. **Scope `/api/sessions` to an owner** — add an `ownerKey` (httpOnly UUID cookie) column + `where:{ownerKey}` on the read; closes the global-read-of-everyone's-notes hole. *(M)*
3. **Raise the segmented tabs to ≥44pt** — `min-height:44px` on `.tabs button`; the most-used control, currently 32.5px. *(S)*
4. **Decouple the forward button from the timer** — drop `&& secondsLeft > 0` so the user can't be stranded mid-step at 0:00. *(S)*
5. **Add a token-bound `:focus-visible` ring** to all buttons (one rule, `outline 2px var(--primary)` + offset). *(S)*
6. **Fix the sub-44pt touch controls** — chips, the delay toggle, and the tablet-band demo pill (`min-height:44px`, enlarge the checkbox to 22px). *(S)*
7. **Make full-screen orientation/height-aware** — key the existing block on `(max-width:460px),(max-height:600px)` so landscape phones aren't 59% clipped. *(S)*
8. **Hide the fake iOS chrome in full-screen mode** and add `env(safe-area-inset-*)` padding so it doesn't double-draw over the real status bar / home indicator. *(S)*
9. **Add `compression()` + asset `Cache-Control`** to Express — ~120 KB off first paint and 0-RTT cache hits on revisits. *(S)*
10. **Harden the container + DB** — add `USER node` to the Dockerfile and fail-fast if production falls back to ephemeral SQLite. *(S)*

Beyond the top 10: gate Switch-On Finish on at least one intention, soften the unfulfilled "3-min nudge" copy, add a request logger, bind the icon `muted` grey to `--muted`, and introduce a `--text-*` / `--space-*` token ramp to close the last design-system parity gaps.

---

## What's already good

The prototype gets the hard parts right, and several of these should be protected during the fixes above:

- **One real design system.** Web and Figma share the same token names and values, the same SF Pro stack, and the same three documented modes — verified from both sides, no divergence.
- **iOS-correct foundations.** `100dvh` (not `vh`) for the full-screen frame, 17px inputs that dodge iOS auto-zoom, and a concentric-friendly radius scale.
- **Accessibility considered.** `prefers-reduced-motion` terminates the infinite animations and short-circuits the Ring's rAF count-up; inputs get a deliberate high-contrast focus treatment (7.30:1); the dark palette comfortably clears WCAG AA for text; controls pass 2.5.8 Target Size (AA, 24px); `aria-pressed` exposes the selected tab; the delay-toggle `<label>` wraps both checkbox and text. There are `aria-label`s on the icon controls.
- **Robust client fetching.** The Today fetch is `AbortController`-guarded against the React 18 double-effect race and surfaces a real error state.
- **Server-side discipline.** Input validation (length-clamped intentions/note, integer-clamped duration), `express-rate-limit` on `/api`, a tight Helmet CSP (`scriptSrc 'self'`, `objectSrc/frameAncestors 'none'`, `baseUri 'self'`), and a 16kb JSON body limit.
- **Honest engineering.** The code already warns when it falls back to ephemeral SQLite, anticipates the real Dynamic Island (hiding the fake one at the mobile breakpoint), and preserves typed data across a failed save. The performance and indexing non-issues were recorded with evidence rather than guessed at.
