# Threshold — Design System & Direction

> Research-backed visual direction for the Figma design system + screens. Sources: Apple HIG
> (typography/layout/materials), NN/g (Liquid Glass), dark-mode & 2025-26 mobile-UI trend roundups,
> Transit/Calm/Endel/Apple-rings pattern studies. Figma file: `aJRy71rHbxzfzXQ5qQf6h6`.
> Font confirmed available in Figma: **SF Pro** (used everywhere).

## Direction in one line
Calm, modern, native-iOS. Dark-first, near-black blue-charcoal canvas, **one vivid accent**, elevation
by *lightening* surfaces + hairline borders (not heavy shadows), big confident SF Pro headlines,
continuous/squircle corners, and a confidence ring colored by *calm-vs-uncertain* (teal→amber→red).

## Frame & layout constants (iOS, verified)
- **Device frame: 402 × 874 pt** (iPhone 16 **and** 17 Pro — identical).
- Screen margins **16**, **8pt** grid (4pt half-steps), min tap target **44×44**.
- Status bar / Dynamic Island region **~59**, home-indicator safe area **~34**, tab bar **49**, nav bar **44**.

## Tokens — architecture (3 modes, the whole point)
One semantic layer, **three modes**, so the same components render as wireframe *or* finished UI:

- **Collection `Primitives`** (1 mode `Value`) — raw values, scope `[]` (hidden from pickers).
- **Collection `Spacing`** (1 mode `Value`) — spacing/radius/size numbers.
- **Collection `Theme`** (modes **`Wireframe` · `Light` · `Dark`**) — semantic colors aliased to primitives.

### Primitives (hex)
Neutrals (gray): `0 #FFFFFF · 50 #F7F8FA · 100 #F0F2F5 · 200 #E3E7EC · 300 #D5D8DD · 400 #B3B9C2 ·
500 #8A9099 · 600 #5B6470 · 700 #3A4049 · 800 #2E333B · 900 #1C1F24 · 950 #0B0F14` + `black #000000`.
Ink (dark theme): `bg #0B0F14 · surface #141A22 · surface2 #1E2630 · overlay #262E3A · border #2A3340 ·
text #ECEFF4 · muted #9AA4B2`.
Accents: `blue/dark #4AA3FF · blue/light #0A84FF · blue/on #06223A · violet/500 #A78BFA ·
violet/600 #7C3AED · teal #34D399 · amber #FBBF24 · red #FF453A`.

### Semantic `Theme` (Wireframe / Light / Dark → primitive)
| token | Wireframe | Light | Dark |
|---|---|---|---|
| `color/bg` | gray/0 | gray/50 | ink/bg |
| `color/surface` | gray/100 | gray/0 | ink/surface |
| `color/surface-2` | gray/200 | gray/100 | ink/surface2 |
| `color/elevated` | gray/200 | gray/0 | ink/overlay |
| `color/border` | gray/300 | gray/200 | ink/border |
| `color/text` | gray/900 | gray/950 | ink/text |
| `color/text-muted` | gray/500 | gray/600 | ink/muted |
| `color/primary` | gray/800 | blue/light | blue/dark |
| `color/on-primary` | gray/0 | gray/0 | blue/on |
| `color/accent` | gray/600 | violet/600 | violet/500 |
| `color/success` | gray/500 | teal | teal |
| `color/warning` | gray/600 | amber | amber |
| `color/danger` | gray/700 | red | red |
| `color/statusbar-bg` | **black** | gray/50 | ink/bg |
| `color/statusbar-fg` | gray/0 | gray/950 | ink/text |
| `color/ring-track` | gray/300 | gray/200 | ink/surface2 |

Wireframe keeps success/warning/danger as grays → screens read as true grayscale low-fi (status bar
black, surfaces light-gray). Light/Dark light up the accent + state colors.

### Spacing / radius / size (Number)
`space/4·8·12·16·20·24·32·40` · `radius/sm 10 · md 16 · lg 20 · xl 28 · pill 999` ·
`size/statusbar 59 · size/tap 44 · size/home 34` · `stroke/hairline 1`.

## Type styles — SF Pro ramp (iOS)
| Style | Family/Weight | Size | Line | Tracking |
|---|---|---|---|---|
| Large Title | SF Pro Bold | 34 | 41 | -1.0 |
| Title 1 | SF Pro Bold | 28 | 34 | -0.8 |
| Title 2 | SF Pro Bold | 22 | 28 | -0.5 |
| Title 3 | SF Pro Semibold | 20 | 25 | -0.4 |
| Headline | SF Pro Semibold | 17 | 22 | -0.4 |
| Body | SF Pro Regular | 17 | 22 | -0.4 |
| Callout | SF Pro Regular | 16 | 21 | -0.3 |
| Subhead | SF Pro Regular | 15 | 20 | -0.2 |
| Footnote | SF Pro Regular | 13 | 18 | 0 |
| Caption | SF Pro Regular | 12 | 16 | 0 |
| Overline | SF Pro Semibold | 11 | 13 | +0.6 (UPPERCASE) |

## Components (atoms → molecules)
StatusBar (iOS, time + DI + indicators) · HomeIndicator · SegmentedTabs (Today/Transition) · Button
(primary/secondary) · Chip (default/active) · Card (surface + hairline) · ConfidenceRing (round-cap,
gradient, center %, colored by level) · TripRow · BackupChip · Pill (on/off) · TextField · StepProgress.

## Screens (built in Wireframe mode, then Light + Dark)
1. Today / Plan — on time  2. Today / Plan — delay + reframe  3. Transition — setup
4. Transition — running (timer + step + intentions)  5. Transition — done + history.

## Build notes
- SF Pro weights in Figma: `Regular · Medium · Semibold · Bold · Heavy` (note: "Semibold", no space).
- Bind every visual property (fill/stroke/radius/gap) to a token; scopes set on every variable; WEB
  code syntax `var(--token)`.
- Confidence ring: rounded caps, angular gradient (same hue dark→light), ~16pt stroke, tabular %, tip glow.
- Run ID: `threshold-ds-2026-06-09` · state ledger `/tmp/dsb-state-threshold-ds-2026-06-09.json`.

## Delivered (Figma)

**File:** https://www.figma.com/design/aJRy71rHbxzfzXQ5qQf6h6 (key `aJRy71rHbxzfzXQ5qQf6h6`).

Pages: **Cover · 🎨 Foundations · 🧩 Components · 📐 Wireframes (low-fi) · ✨ UI — Dark · ✨ UI — Light**.

- **Tokens:** `Primitives` (28 colors incl. neutral greys) + `Spacing` (19 numbers) + `Theme` (16 semantic
  colors × **3 modes**: Wireframe / Light / Dark). Scopes + WEB `var(--token)` code syntax set.
- **Text styles:** 14-style SF Pro iOS ramp (Display → Caption, incl. Subhead Emphasized).
- **Components:** StatusBar, HomeIndicator, SegmentedTabs, Button (8 variants), Chip, Pill, TextField, plus the
  ConfidenceRing, PlanCard, ModeCard, ReframeCard, InfoChip, HistoryItem molecules and an inline-SVG SF Symbols
  Icon set (10 glyphs) — all colour-bound to semantic tokens.
- **Screens:** 5 screens (Today on-time / Today delay+reframe / Transition setup / running / done), each on
  a 402×874 iPhone frame, built **once** and shown in all three modes by switching the frame's Theme mode —
  Wireframe page uses the **Hoppit neutral palette** (status bar #1A1A1A, surfaces #F2F2F2/#FFFFFF), Dark &
  Light pages are the finished UI (sky/violet accents, teal/amber confidence ring).

**Font handling (important):** Figma's headless MCP renderer lists SF Pro but has no metrics for it, so the
in-plugin layout engine measures SF Pro text as 0-width (collapsing auto-layout). Workaround used: every
screen was **built and sized in Inter** (metrically near-identical, reliably measured), then **all text was
swapped to SF Pro** at the end. Because the containers were already sized, SF Pro drops in cleanly and renders
correctly via the server render path and on any machine with SF Pro installed (e.g. macOS). If SF Pro ever
shows as "missing font", a one-click global font swap back to Inter restores it.

