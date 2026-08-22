import perf from '../data/performance.json'

// The asset catalog. Sector picks resolve to the SPDR sector ETF's return, so
// a sector choice pays the sector, not one cherry-picked company. `hint` shows
// familiar names from that sector's top holdings.
export const SECTORS = [
  { id: 'XLK', key: 'tech', hint: 'NVIDIA · Apple · Microsoft' },
  { id: 'XLE', key: 'energy', hint: 'ExxonMobil · Chevron' },
  { id: 'XLV', key: 'health', hint: 'Eli Lilly · J&J · Pfizer' },
  { id: 'XLF', key: 'fin', hint: 'JPMorgan · Visa' },
  { id: 'XLY', key: 'consumer', hint: 'Amazon · Tesla · McDonald’s' },
  { id: 'XLC', key: 'media', hint: 'Meta · Netflix · Disney' },
]

export const CORP_BONDS = ['DELFIN', 'ELEVING', 'GRENARDI', 'STORENT']
export const BOND_IDS = ['GOVT', ...CORP_BONDS]
export const BOND_FREQ = {
  GOVT: 'freqAnnual', DELFIN: 'freqMonthly', ELEVING: 'freqSemi', GRENARDI: 'freqAnnual', STORENT: 'freqQuarterly',
}
export const FUND_IDS = ['SPY', 'SIGNET']

// Column order is also the allocation bar's segment order.
export const CATALOG = [
  ...SECTORS.map((s) => s.id),
  ...BOND_IDS,
  ...FUND_IDS,
]

export const TOTAL = 10000
export const STEP = 1000

// The result screen's "what if" strip: market, the Signet fund, the safe floor.
export const COMPARE_SET = ['SPY', 'SIGNET', 'GOVT']

export const MONTHS = perf.meta.months
export const META = perf.meta

export function inst(id) {
  return perf.instruments[id]
}

export function isBond(id) {
  return BOND_IDS.includes(id)
}

export function assetClass(id) {
  if (isBond(id)) return 'bonds'
  if (FUND_IDS.includes(id)) return 'funds'
  return 'stocks'
}

// alloc: { assetId: eur }. Series of the whole basket (each instrument series
// is per-10 000, so scale by the allocated share).
export function portfolioSeries(alloc) {
  const ids = Object.keys(alloc).filter((id) => alloc[id] > 0)
  return MONTHS.map((_, i) =>
    ids.reduce((sum, id) => sum + (inst(id).values[i] * alloc[id]) / TOTAL, 0)
  )
}

// Biggest single-month gain and drop, in percent.
export function bestWorstMonth(values) {
  let best = -Infinity
  let worst = Infinity
  for (let i = 1; i < values.length; i++) {
    const chg = (values[i] / values[i - 1] - 1) * 100
    if (chg > best) best = chg
    if (chg < worst) worst = chg
  }
  return { best, worst }
}

// Display name for an asset. Sectors and government bonds localize via the
// dict/t the caller provides; company and fund names come from the data.
export function assetLabel(id, t, dict, { long = false } = {}) {
  if (id === 'GOVT') return long ? t('govtName') : t('govtShort')
  if (id === 'SPY') return long ? 'SPY (S&P 500)' : 'SPY'
  if (id === 'SIGNET') return 'Signet Baltic Bond Fund'
  const s = SECTORS.find((x) => x.id === id)
  return s ? dict.sectors[s.key] : inst(id).name
}
