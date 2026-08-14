# Signet Invest Game — Handoff

"Kur tu ieguldītu 10 000 €?" — a Signet Bank kiosk web game. The visitor splits
10 000 EUR across stock sectors, bonds and funds, then sees the real
trailing-12-months outcome, with the Signet Baltic Bond Fund drawn as the calm
benchmark under every result. A second mini-game, the Baltic market quiz
(5 questions), lives on the same start screen.

_Last updated: 2026-08-14._

## Where everything lives
- **Source:** `~/signet-invest-game` (built here because macOS privacy blocked
  terminal READS of `~/Desktop/Side project/Desig_proejects/` that session;
  `mv` the folder there if wanted, nothing depends on the path)
- **Run locally:** `npm run dev` (vite, :5173) or open `dist/index.html`
  directly - the build is ONE self-contained file (fonts inlined, offline-safe).
- **Preview server used during the session:** `python3 -m http.server 8791` in
  `dist/` (http://localhost:8791).
- Design base reused from the public `bendiksdaniels/signet-number-game` repo
  (tokens.css, FitToScreen, hooks, fonts, singlefile build). No GitHub repo
  created for THIS project yet; `.github/workflows/deploy.yml` is carried over
  and will auto-deploy Pages if pushed to a repo with Pages enabled.

## Stack
React 18 + Vite + framer-motion, `vite-plugin-singlefile`. Self-hosted fonts
via @fontsource: Space Grotesk (UI/display) + Spectral (serif) - both cover
Latvian diacritics. LV is the default language, EN via the header toggle;
all copy in `src/i18n.js` (incl. the quiz question bank `QUIZ`).

## Screens (`src/App.jsx` phases)
- `attract` - SPLIT SCREEN: left half is the 10k game (hero question), right
  half is the quiz (bronze "?" motif). Tapping a half expands it across the
  stage (0.5 s), then the game crossfades in (slide dir 0 in App.jsx). Idle
  reset returns here after 75 s of no pointer events.
- `build` - `Builder.jsx`: the allocator. Tap = +1 000 €, minus pill = -1 000 €;
  segmented allocation bar colored by asset class; "?" on each column opens an
  explainer modal (what stocks/bonds/funds are); CTA enables at exactly 0 € left.
- `quiz` - `Quiz.jsx`: 5 multiple-choice questions, instant right/wrong marking
  plus a one-line fact per question, score screen with a band title; the score
  screen's primary CTA funnels into the builder.
- `result` - `Result.jsx`: count-up final value + % badge, the money chart
  (line, or a literal coupon staircase when the whole basket is bonds), the
  dashed "Signet fonds" benchmark under every non-fund-only pick, per-asset
  breakdown, "if you had chosen differently" compare bars, the fund panel + CTA,
  disclaimer. Fits 100svh on landscape - no scrolling on a kiosk.

## Data (`src/data/performance.json`, regenerate: `npm run refresh-data`)
Window: 2025-08 -> 2026-08 (13 monthly points, each series normalized to
10 000 EUR at start).
- **Sectors** = SPDR sector ETFs from Yahoo Finance (dividend-adjusted closes),
  converted USD->EUR with monthly EURUSD: XLK +48.3 %, XLE +41.4 %, XLV +26.5 %,
  XLF +11.2 %, XLY +4.6 %, XLC +3.8 %. SPY +23.8 %.
- **Bonds** = coupon-accrual staircases at par, real issues: DelfinGroup 10 %
  (monthly, 09.2025 issue), Eleving Group 9.5 % (semi-annual, 2025/2030 EUR 275m),
  Grenardi Group 10 % (annual, subordinated 05.2026), Latvian government 3.2 %
  (10Y yield at purchase, ECB series IRS.M.LV: 2025-08 = 3.17).
- **Signet Baltic Bond Fund** = NAV interpolated between published anchors:
  100.00 at inception 2025-05-09, +7.6 % first year (press release), 109.815 on
  2026-08-13 (signetbank.com) -> trailing 12M +8.0 %.
- Quiz facts hard-code two data points (10Y yield ~3.7 %, tech sector +48 %) -
  refresh them by hand in `i18n.js` when the data refreshes.

## Design decisions
- Brand system ported verbatim from the number game (`tokens.css`): warm
  charcoal #282623, bronze ramp around #b27e54, paper creams.
- Line-language iconography: jagged = stocks, staircase = bonds, smooth = funds
  (`PathGlyph` in charts.jsx). The same glyphs head the builder columns and the
  info modals.
- The signature moment: the money line draws itself (1.6 s) with the bronze
  dashed Signet-fund counterpoint beneath it; bond baskets draw as literal
  staircases.
- Latvian number formatting everywhere in LV: space thousands, decimal comma,
  sign after the number ("12 376 €", "+31,5 %"); EN uses "€12,376" / "+31.5%".
  No em dashes anywhere.
- Compliance: disclaimer (game simulation, past performance, not advice) on the
  step footer and the result panel.

## Gotchas (hard-won)
- **Never define a component inside another component's render** (the original
  `Card` inside `Builder` bug): the type changes every render, React remounts
  everything, and mid-interaction DOM nodes go stale.
- **Playwright verification:** drive with real bubbling `MouseEvent('click')` /
  `element.click()`; React state updates land AFTER the evaluate call, so read
  results in the NEXT call. Synthetic clicks do NOT reset the 75 s idle timer
  (it listens for pointerdown) - long test sessions get bounced back to
  attract mid-flow; do each flow in one fast evaluate.
- **Screenshot hangs:** if `browser_take_screenshot` times out repeatedly,
  the browser session is wedged - `browser_close` + re-navigate fixes it.
- **macOS TCC:** terminal reads of `~/Desktop/Side project/Desig_proejects/`
  returned "Operation not permitted" (writes went through!). Two junk folders
  (`signet_invest_game`, `probe_test`) were left there and could not be
  removed - trash them in Finder.

## Verification done (2026-08-14, all against the built dist)
- Full flows: mixed 4/2/1/3 portfolio -> 12 337 € / +23,4 % (hand-checked to the
  euro); all-in DelfinGroup EN -> €11,000 staircase, coupon stats; all-in SPY ->
  12 376 €, compare dedupes the SPY row; quiz 4/5 -> "Drošs investors", wrong
  answers mark red, facts render.
- Fits 1440x900 with zero page scroll (result panels measured 900/900).
- Screenshots in `docs/screenshots/`.

## TODO / next steps
- Create a GitHub repo + Pages deploy if a public URL is wanted (workflow file
  is ready; the singlefile build also just works from a USB stick).
- The fund CTA links to the signetbank.com fund page; swap for a QR or a real
  campaign URL when the stand setup is known.
- If the window should roll forward later: `npm run refresh-data`, update the
  two hard-coded quiz facts, rebuild.
