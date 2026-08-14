# Signet Invest Game

Kur tu ieguldītu 10 000 €? A Signet Bank kiosk web game (LV/EN).

Two games on one split start screen:
- **Sadali 10 000 €** — deal 10 000 EUR out in 1 000 EUR taps across stock
  sectors (real SPDR ETF returns in EUR), Baltic bonds (real coupons) and funds
  (SPY, Signet Baltic Bond Fund), then watch the real trailing-12-months
  outcome draw itself, with the Signet fund as the calm dashed benchmark.
- **Tirgus viktorīna** — 5 quick questions about the Baltic capital market,
  each answer teaches one fact.

## Run

```bash
npm install
npm run dev            # localhost:5173
npm run build          # dist/index.html — ONE self-contained file, offline-safe
npm run refresh-data   # re-fetch market data, regenerate src/data/performance.json
```

Read `HANDOFF.md` for the full state snapshot, data sources and gotchas.
