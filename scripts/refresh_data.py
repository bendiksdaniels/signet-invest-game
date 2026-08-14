#!/usr/bin/env python3
"""Regenerate src/data/performance.json for the invest game.

Stocks + SPY: Yahoo Finance monthly adjusted closes (dividend-adjusted),
converted USD -> EUR with the EURUSD monthly rate, normalized to a 10 000 EUR
investment at the start of the window.

Bonds: coupon-accrual staircases (principal + coupons received to date, held
at par). Rates are from the real issues named below.

Signet Baltic Bond Fund: NAV interpolated between published anchors
(inception 100.00 on 2025-05-09, +7.6% first year per press release,
109.815 on 2026-08-13 per signetbank.com).

Usage:
  python3 scripts/refresh_data.py                # fetch live from Yahoo
  python3 scripts/refresh_data.py --cache F.json # reuse a cached fetch
"""
import argparse, datetime as dt, json, math, os, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "data", "performance.json")

START = 1754006400  # 2025-08-01 UTC
# Sector picks resolve to the real SPDR sector ETF's return (EUR terms), so a
# "sector" is the actual sector, not one cherry-picked company.
TICKERS = {
    "XLK": "Technology (XLK)", "XLE": "Energy (XLE)", "XLV": "Healthcare (XLV)",
    "XLF": "Financials (XLF)", "XLY": "Consumer (XLY)", "XLC": "Media (XLC)",
    "SPY": "SPY (S&P 500)",
}

# Real issues: DelfinGroup 09.2025 public issue (10%, monthly coupon);
# Eleving Group 2025/2030 eurobonds (9.5%, semi-annual); Grenardi Group
# 05.2026 subordinated (10%, annual); Latvia 10Y government yield at
# purchase, ECB series IRS.M.LV (2025-08: 3.17 -> 3.2).
BONDS = {
    "GOVT": {"name": None, "coupon": 3.2, "freq": 1},
    "DELFIN": {"name": "DelfinGroup", "coupon": 10.0, "freq": 12},
    "ELEVING": {"name": "Eleving Group", "coupon": 9.5, "freq": 2},
    "GRENARDI": {"name": "Grenardi Group", "coupon": 10.0, "freq": 1},
}

FUND_ANCHORS = [("2025-05-09", 100.0), ("2026-05-09", 107.6), ("2026-08-13", 109.815)]

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}


def yahoo(symbol):
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
           f"?period1={START}&period2={int(time.time())}&interval=1mo")
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        j = json.load(r)
    res = j["chart"]["result"][0]
    return [(t, a) for t, a in zip(res["timestamp"], res["indicators"]["adjclose"][0]["adjclose"])
            if a is not None]


def month_label(ts):
    return time.strftime("%Y-%m", time.gmtime(ts))


def fetch_stocks():
    fx = {month_label(t): v for t, v in yahoo("EURUSD=X")}
    out = {}
    for sym, name in TICKERS.items():
        for attempt in range(3):
            try:
                pts = yahoo(sym)
                break
            except Exception as e:
                if attempt == 2:
                    sys.exit(f"FAIL {sym}: {e}")
                time.sleep(2)
        series = [(month_label(t), usd / fx[month_label(t)]) for t, usd in pts
                  if month_label(t) in fx]
        base = series[0][1]
        out[sym] = {"name": name,
                    "months": [m for m, _ in series],
                    "values": [round(10000 * v / base, 2) for _, v in series]}
        time.sleep(0.4)
    return out


def bond_series(coupon, freq, n_months):
    # Principal + coupons received to date (par, no reinvestment): a staircase.
    vals = []
    for k in range(n_months):
        paid = math.floor(k * freq / 12) / freq
        vals.append(round(10000 * (1 + coupon / 100 * paid), 2))
    return vals


def fund_series(months):
    anchors = [(dt.date.fromisoformat(d).toordinal(), math.log(v)) for d, v in FUND_ANCHORS]

    def nav(o):
        if o <= anchors[0][0]:
            return math.exp(anchors[0][1])
        for (o1, l1), (o2, l2) in zip(anchors, anchors[1:]):
            if o <= o2:
                return math.exp(l1 + (l2 - l1) * (o - o1) / (o2 - o1))
        return math.exp(anchors[-1][1])

    dates = [dt.date.fromisoformat(m + "-01").toordinal() for m in months]
    dates[-1] = anchors[-1][0]  # last point = latest published NAV
    base = nav(dates[0])
    return [round(10000 * nav(o) / base, 2) for o in dates]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", help="path to a cached fetch (fetch_market_data.py output)")
    args = ap.parse_args()

    if args.cache:
        raw = json.load(open(args.cache))
        stocks = {sym: {"name": d["name"], "months": d["months"], "values": d["values"]}
                  for sym, d in raw.items()}
    else:
        stocks = fetch_stocks()

    months = stocks["SPY"]["months"]
    n = len(months)
    instruments = {}
    for sym, d in stocks.items():
        assert d["months"] == months, f"{sym} month grid differs"
        instruments[sym] = {"name": d["name"], "values": d["values"]}
    for bid, b in BONDS.items():
        instruments[bid] = {"name": b["name"], "values": bond_series(b["coupon"], b["freq"], n),
                            "coupon": b["coupon"]}
    instruments["SIGNET"] = {"name": "Signet Baltic Bond Fund", "values": fund_series(months)}

    for d in instruments.values():
        d["ret"] = round((d["values"][-1] / 10000 - 1) * 100, 1)

    data = {"meta": {"months": months,
                     "fetched": dt.date.today().isoformat(),
                     "window": f"{months[0]} – {months[-1]}"},
            "instruments": instruments}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(data, f, indent=1)
    for k, d in instruments.items():
        print(f"{k:9s} {str(d['name']):22s} {d['ret']:+6.1f}%  ({len(d['values'])} pts)")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
