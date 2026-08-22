# 2026-08-22: e-mail gate, Storent bonds, coupon wording

- [x] Storent Europe bond (10 %, quarterly) in refresh_data.py + performance.json, re-derived from the existing file (stocks byte-identical)
- [x] STORENT in gamedata.js (CORP_BONDS, BOND_FREQ quarterly) + "reizi ceturksnī"/"quarterly"
- [x] Quiz Q3 + bonds explainer: coupon = regular interest, fixed or floating (LV/EN)
- [x] EmailGate.jsx phase between builder and result (valid e-mail + consent, skip link)
- [x] leads.js: localStorage store, CSV export panel at #leads, optional VITE_LEADS_ENDPOINT POST queue
- [x] Build + Playwright checks (gate validation, submit, skip, Storent staircase, #leads panel)
- [x] HANDOFF.md / README.md updated
- [x] Leads land on the server: ~/signet-leads (Rust, :8803) behind leads.dbautomatizacijas.com, LEADS_ENDPOINT repo variable set, digest mail 07:45 Riga

## Review
Everything is live: the gate, Storent, the coupon wording, and the server
collector with the morning digest. Verified end to end from the live page.
