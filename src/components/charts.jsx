import { motion, useReducedMotion } from 'framer-motion'
import { formatMoney, formatMonth, formatPct } from '../lib/format.js'

const EASE = [0.22, 1, 0.36, 1]

// The line-language glyphs: return shape as identity. Jagged = stocks,
// staircase = bonds (coupons), smooth rise = funds.
const GLYPHS = {
  stocks: 'M3 30 L18 14 L32 24 L48 9 L62 21 L78 7 L93 13',
  bonds: 'M3 34 H26 V24 H50 V15 H74 V7 H93',
  funds: 'M3 34 C30 32, 52 26, 70 17 C80 13, 88 9, 93 7',
}

export function PathGlyph({ kind, className }) {
  const reduce = useReducedMotion()
  return (
    <svg className={className} viewBox="0 0 96 40" fill="none" aria-hidden="true">
      <motion.path
        d={GLYPHS[kind]}
        stroke="var(--accent-on-dark)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// The hero: 10 000 EUR travelling through 12 months. Draws itself, with the
// Signet fund as a quiet dashed counterpoint underneath volatile picks.
// `kind`: 'line' (stocks/funds) | 'steps' (bond coupon staircase).
// ---------------------------------------------------------------------------
const W = 720
const H = 372

export function MoneyChart({ values, months, lang, kind = 'line', benchmark = null, benchmarkLabel = '' }) {
  const reduce = useReducedMotion()
  const pad = { l: 16, r: 112, t: 26, b: 40 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const n = values.length

  const all = benchmark ? [...values, ...benchmark, 10000] : [...values, 10000]
  const lo0 = Math.min(...all)
  const hi0 = Math.max(...all)
  const span = Math.max(hi0 - lo0, 400)
  const lo = lo0 - span * 0.08
  const hi = hi0 + span * 0.08

  const x = (i) => pad.l + (i * iw) / (n - 1)
  const y = (v) => pad.t + ih - ((v - lo) / (hi - lo)) * ih

  const linePath = (vals) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const stepPath = (vals) => {
    let d = `M${x(0).toFixed(1)} ${y(vals[0]).toFixed(1)}`
    for (let i = 1; i < vals.length; i++) d += ` H${x(i).toFixed(1)} V${y(vals[i]).toFixed(1)}`
    return d
  }
  const mainPath = kind === 'steps' ? stepPath(values) : linePath(values)
  const floorY = pad.t + ih
  const areaPath = `${mainPath} L${x(n - 1).toFixed(1)} ${floorY} L${x(0).toFixed(1)} ${floorY} Z`

  const baseY = y(10000)
  const endX = x(n - 1)
  const endY = y(values[n - 1])
  // Nudge the benchmark's end label away from the main end dot if they collide.
  let benchLabelY = benchmark ? y(benchmark[benchmark.length - 1]) : 0
  if (benchmark && Math.abs(benchLabelY - endY) < 26) benchLabelY = benchLabelY > endY ? endY + 26 : endY - 26

  const draw = reduce
    ? {}
    : { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.6, ease: EASE } }
  const late = (delay, to = 1) =>
    reduce
      ? {}
      : { initial: { opacity: 0 }, animate: { opacity: to }, transition: { duration: 0.5, delay, ease: EASE } }

  return (
    <svg className="moneychart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img">
      <defs>
        <linearGradient id="mc-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline: the 10 000 EUR you walked in with */}
      <line x1={pad.l} y1={baseY} x2={W - pad.r + 60} y2={baseY} className="mc-base" />
      <text x={W - 4} y={baseY + 17} className="mc-baselabel" textAnchor="end">
        {formatMoney(10000, lang)}
      </text>

      {/* month ticks + start/end labels */}
      {months.map((m, i) => (
        <line key={m} x1={x(i)} y1={floorY + 6} x2={x(i)} y2={floorY + 11} className="mc-tick" />
      ))}
      <text x={x(0)} y={H - 8} className="mc-axis" textAnchor="start">
        {formatMonth(months[0], lang)}
      </text>
      <text x={endX} y={H - 8} className="mc-axis" textAnchor="middle">
        {formatMonth(months[n - 1], lang)}
      </text>

      {/* benchmark counterpoint (the Signet fund) */}
      {benchmark && (
        <motion.g {...late(1.75, 0.85)}>
          <path d={linePath(benchmark)} className="mc-bench" />
          <text x={endX + 10} y={benchLabelY + 4} className="mc-benchlabel" textAnchor="start">
            {benchmarkLabel}
          </text>
        </motion.g>
      )}

      {/* the money line */}
      <motion.path d={areaPath} fill="url(#mc-area)" stroke="none" {...late(1.35, 1)} />
      <motion.path d={mainPath} className="mc-main" {...draw} />
      <motion.circle
        cx={endX}
        cy={endY}
        r="7"
        className="mc-dot"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.5, ease: EASE }}
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// "If you had chosen differently": centre-zero bars, green right, red left.
// rows: [{ id, label, ret, you, fund }]
// ---------------------------------------------------------------------------
export function CompareBars({ rows, lang }) {
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.ret)), 1)
  return (
    <div className="compare">
      {rows.map((r, i) => {
        const w = (Math.abs(r.ret) / maxAbs) * 50
        const pos = r.ret >= 0
        return (
          <motion.div
            key={r.id}
            className={'compare__row' + (r.you ? ' compare__row--you' : '') + (r.fund ? ' compare__row--fund' : '')}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.14, duration: 0.45, ease: EASE }}
          >
            <span className="compare__label">{r.label}</span>
            <span className="compare__track">
              <i className="compare__zero" />
              <motion.i
                className={'compare__bar ' + (pos ? 'is-pos' : 'is-neg')}
                style={pos ? { left: '50%' } : { right: '50%' }}
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ delay: 1.05 + i * 0.14, duration: 0.6, ease: EASE }}
              />
            </span>
            <span className={'compare__val tnum ' + (pos ? 'is-pos' : 'is-neg')}>{formatPct(r.ret, lang)}</span>
          </motion.div>
        )
      })}
    </div>
  )
}
