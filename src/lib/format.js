// Locale-aware formatting. Latvian: space-grouped thousands, decimal comma,
// currency/percent sign after the number with a non-breaking space
// ("10 000 €", "+31,5 %"). English: "€10,000", "+31.5%".
const NB = ' '

export function groupThousands(n, sep) {
  return Math.round(Math.abs(Number(n) || 0))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, sep)
}

export function formatMoney(n, lang = 'lv') {
  const v = Math.round(Number(n) || 0)
  const sign = v < 0 ? '-' : ''
  return lang === 'lv'
    ? `${sign}${groupThousands(v, NB)}${NB}€`
    : `${sign}€${groupThousands(v, ',')}`
}

export function formatPct(x, lang = 'lv', { signed = true, decimals = 1 } = {}) {
  const v = Number(x) || 0
  const sign = v > 0 && signed ? '+' : v < 0 ? '-' : ''
  let num = Math.abs(v).toFixed(decimals)
  if (lang === 'lv') num = num.replace('.', ',')
  return lang === 'lv' ? `${sign}${num}${NB}%` : `${sign}${num}%`
}

const MONTHS_LV = ['janv.', 'febr.', 'marts', 'apr.', 'maijs', 'jūn.', 'jūl.', 'aug.', 'sept.', 'okt.', 'nov.', 'dec.']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "2025-08" -> "aug. 2025" (lv) / "Aug 2025" (en)
export function formatMonth(ym, lang = 'lv') {
  const [y, m] = ym.split('-').map(Number)
  const names = lang === 'lv' ? MONTHS_LV : MONTHS_EN
  return `${names[m - 1]}${NB}${y}`
}
