# Signet Invest Game

Kur tu ieguldītu 10 000 €? A Signet Bank kiosk web game (LV/EN).

Two games on one split start screen:
- **Sadali 10 000 €** — deal 10 000 EUR out in 1 000 EUR taps across stock
  sectors (real SPDR ETF returns in EUR), Baltic bonds (real coupons: DelfinGroup,
  Eleving, Grenardi, Storent Europe, Latvian government) and funds (SPY, Signet
  Baltic Bond Fund), leave an e-mail, then watch the real trailing-12-months
  outcome draw itself, with the Signet fund as the calm dashed benchmark.
- **Tirgus viktorīna** — 5 quick questions about the Baltic capital market,
  each answer teaches one fact.

## Run

```bash
npm install
npm run dev            # localhost:5173
npm run build          # dist/index.html — ONE self-contained file, offline-safe
npm run refresh-data   # re-fetch market data, regenerate src/data/performance.json
python3 scripts/refresh_data.py --cache src/data/performance.json
                       # re-derive bonds + fund only (e.g. after adding a bond)
```

## Leads

The e-mail gate before the result stores every lead on the device (localStorage).
Open `<url>#leads` to copy or download them as CSV. To also send them to a
server, set the `LEADS_ENDPOINT` repository variable (baked in as
`VITE_LEADS_ENDPOINT` at build time).

Read `HANDOFF.md` for the full state snapshot, data sources and gotchas.
