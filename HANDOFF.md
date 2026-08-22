# Signet Invest Game — Handoff

"Kur tu ieguldītu 10 000 €?" — a Signet Bank kiosk web game. The visitor splits
10 000 EUR across stock sectors, bonds and funds, then sees the real
trailing-12-months outcome, with the Signet Baltic Bond Fund drawn as the calm
benchmark under every result. Before the result an e-mail gate collects the
visitor's address (see Lead capture). A second mini-game, the Baltic market
quiz (5 questions), lives on the same start screen.

_Last updated: 2026-08-22._

## Where everything lives
- **LIVE:** https://bendiksdaniels.github.io/signet-invest-game/
- **Repo:** https://github.com/bendiksdaniels/signet-invest-game (public);
  push to `main` auto-builds and redeploys Pages in about a minute.
- **Source (dev):** `~/signet-invest-game` - develop from here; macOS privacy
  blocks terminal reads of Desktop paths in these sessions.
- **Saved copy:** `~/Desktop/Signet /signet-invest-game` (moved via Finder
  2026-08-14, includes .git, dist and brand/ palette PDF, no node_modules).
  Treat it as Daniel's workspace snapshot; sync it via Finder or git, not cp.
- **Run locally:** `npm run dev` (vite, :5173) or open `dist/index.html`
  directly - the build is ONE self-contained file (fonts inlined, offline-safe).
- **Preview server used during the session:** `python3 -m http.server 8791` in
  `dist/` (http://localhost:8791).
- Design base reused from the public `bendiksdaniels/signet-number-game` repo
  (tokens.css, hooks, fonts, singlefile build).

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
- `email` - `EmailGate.jsx`: e-mail field + consent checkbox between the builder
  and the result. "Skatīt rezultātu" enables only with a valid address AND
  consent; the muted "Turpināt bez e-pasta" link skips (consent stays freely
  given; delete that button + `onSkip` for a hard gate); Back returns to the
  builder with the allocation intact. Submit stores the lead with the outcome
  it is about to see (`App.jsx` submitLead), then slides to the result.
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
  Grenardi Group 10 % (annual, subordinated 05.2026), Storent Europe 10 %
  (quarterly; notes programme 2026/2030, 1st tranche 17.09.2026, EUR 10m, terms
  from the Nasdaq CSD filing that is the oracle in `~/csd-application`; added
  22.08), Latvian government 3.2 % (10Y yield at purchase, ECB series IRS.M.LV:
  2025-08 = 3.17).
- **Adding a bond without refetching:** put it in `BONDS` in `refresh_data.py`,
  then `python3 scripts/refresh_data.py --cache src/data/performance.json`: the
  stock/SPY series and the fetch date are reused from the file, bonds + fund are
  re-derived. Storent went in this way; all 12 existing instruments stayed
  byte-identical (checked).
- **Signet Baltic Bond Fund** = NAV interpolated between published anchors:
  100.00 at inception 2025-05-09, +7.6 % first year (press release), 109.815 on
  2026-08-13 (signetbank.com) -> trailing 12M +8.0 %.
- Quiz facts hard-code two data points (10Y yield ~3.7 %, tech sector +48 %) -
  refresh them by hand in `i18n.js` when the data refreshes.
- Coupon wording (22.08): the quiz's coupon answer and the bonds explainer say
  "regular interest, fixed or floating (e.g. EURIBOR-linked)", never "fixed".

## Lead capture (e-mail gate, 2026-08-22)
- `src/lib/leads.js`: every submitted lead is appended to localStorage
  `signet-invest-leads` (cap 5 000) as `{ts, email, lang, alloc, final, ret}`;
  the e-mail is trimmed + lower-cased. Skips store nothing.
- **Export on the device:** open `<url>#leads` (e.g. in the kiosk's address
  bar) - `LeadsPanel.jsx` shows the CSV (`timestamp,email,lang,final_eur,
  return_pct,allocation`), with Copy / Download CSV / Delete all; Close clears
  the hash. Works in any phase, also over the result.
- **Server collector (LIVE since 22.08):** the repo variable `LEADS_ENDPOINT` =
  `https://leads.dbautomatizacijas.com/api/leads` (deploy.yml bakes it in as
  `VITE_LEADS_ENDPOINT`; locally `VITE_LEADS_ENDPOINT=... npm run build`). Every
  lead is POSTed there as a text/plain JSON body (no CORS preflight); unsent
  ones wait in `signet-invest-leads-queue` and are retried on load, on every
  new lead and when the panel opens, and the server dedupes on (ts, e-mail).
  The collector is `~/signet-leads` (Rust, VPS :8803, Cloudflare Access bypass
  on the POST path only): the list + CSV live at
  https://leads.dbautomatizacijas.com/ (Access login, Daniel + signetbank.com),
  and every morning 07:45 Riga the new e-mails are mailed to
  bendiksdaniels02@gmail.com (`LEADS_EMAIL_TO` in `/opt/signet/env/leads.env`).
  Verified end to end from the live GitHub Pages origin on 22.08.
- Consent copy is `gateConsent` in `i18n.js`; no privacy-policy link yet.

## Design decisions
- **2026 brand update applied** (source of truth: `brand/SignetBank_ColorCodes_
  update_2026.pdf`): typeface Montserrat (@fontsource, all text incl. the old
  serif voice, now Montserrat italic); dark stage = Signet Dark Green #273631 /
  Marble #282623; Signet Gold #B27E54 keeps buttons, kickers and the fund
  identity; light panel = Signet Stone #F4F4F4; muted text = Grey #7F7E7A;
  Neon Green #DEF970 is the pop: the money line, its end dot, the positive
  return badge, the stocks segment in the allocation bar and the "0 € left"
  state. Signet Pink #D6B4B0 is in tokens (--pink) but unused so far. The
  PDF's RGB lines for Marble/Dark Green are copy-paste typos - HEX values are
  authoritative.
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
- Scripted 21-step flow suite (scratchpad flow_test.js) run on Chromium AND real
  WebKit at iPhone 390x844, iPad-landscape 1180x820, MacBook-window 1280x700:
  21/21 PASS on both engines. Rendering also verified in real iOS Simulators
  (iPhone 17 + iPad A16, Safari, live URL).
- 3-agent audit (2026-08-14) found and we fixed: CTA unreachable below ~615px
  height (centered flex overflow escapes the scroll range - now flex-start +
  margin-block auto), stage side-gutter cascade collision, portrait-wide
  windows getting the landscape CSS, exact-900px double-match, Safari <18
  -webkit-backdrop-filter, Safari <16.2 color-mix fallbacks, and a data bug:
  October 2025 silently dropped + August 2026 duplicated in the month grid
  (missing-FX-month row drop; refresh_data.py now dedupes by label,
  forward-fills FX, and asserts a unique shared grid).
- Screenshots in `docs/screenshots/`.

## Verification done (2026-08-22, built dist on :8793, Chromium 1280x700)
- Builder: bond column lists Valsts obligācijas, DelfinGroup, Eleving Group,
  Grenardi Group, Storent Europe ("10 % gadā"); 3/2/2/3 split (tech, Storent,
  Delfin, Signet fund) -> gate -> "not-an-email" shows the red error and keeps
  the CTA disabled, a valid address without consent stays disabled, consent
  enables it, submit -> 12 089 € / +20,9 % (hand-checked), lead stored with
  the allocation and outcome. `#leads` panel lists it as CSV, Close clears the
  hash. All-in Storent -> skip -> 11 000 € staircase with 4 quarterly steps,
  stats "10 %" + "reizi ceturksnī", nothing stored on skip.
- Old copy ("Fiksētie procenti", "fixed interest") no longer in the bundle.

## TODO / next steps
- Add Signet's privacy-policy link next to the consent line if compliance asks.
- Create a GitHub repo + Pages deploy if a public URL is wanted (workflow file
  is ready; the singlefile build also just works from a USB stick).
- The fund CTA links to the signetbank.com fund page; swap for a QR or a real
  campaign URL when the stand setup is known.
- If the window should roll forward later: `npm run refresh-data`, update the
  two hard-coded quiz facts, rebuild.
