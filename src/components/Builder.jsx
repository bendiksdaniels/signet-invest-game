import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT } from '../i18n.js'
import { rise } from './ui.jsx'
import { PathGlyph } from './charts.jsx'
import { SECTORS, BOND_IDS, FUND_IDS, CATALOG, TOTAL, STEP, inst, assetClass, assetLabel } from '../lib/gamedata.js'
import { formatMoney, formatPct } from '../lib/format.js'

// Whole percent coupons print without decimals ("10 %"), halves with ("9,5 %").
const coupon = (v, lang) => formatPct(v, lang, { signed: false, decimals: v % 1 ? 1 : 0 })

// Hoisted so the component type is stable across renders: cards update in
// place instead of remounting on every tap.
function AssetCard({ id, amt, dim, lang, label, sub, onAdd, onSub }) {
  return (
    <button className={'acard' + (amt ? ' acard--on' : '') + (dim ? ' acard--dim' : '')} onClick={() => onAdd(id)}>
      <span className="acard__info">
        <b>{label}</b>
        <span className="acard__sub">{sub}</span>
      </span>
      {amt > 0 && (
        <span className="acard__right">
          <span className="acard__amt tnum">{formatMoney(amt, lang)}</span>
          <span
            className="acard__minus"
            role="button"
            tabIndex={0}
            aria-label="-1000"
            onClick={(e) => {
              e.stopPropagation()
              onSub(id)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                onSub(id)
              }
            }}
          >
            −
          </span>
        </span>
      )}
    </button>
  )
}

// One screen does both choosing and allocating: the visitor deals their
// 10 000 EUR out in 1 000 EUR taps across sectors, bonds and funds.
export default function Builder({ alloc, onChange, onDone, onBack }) {
  const { t, lang, dict } = useT()
  const [info, setInfo] = useState(null) // null | 'stocks' | 'bonds' | 'funds'
  const used = Object.values(alloc).reduce((a, b) => a + b, 0)
  const left = TOTAL - used
  const infoKey = (k, part) => 'info' + k[0].toUpperCase() + k.slice(1) + part

  const add = (id) => {
    if (left < STEP) return
    onChange({ ...alloc, [id]: (alloc[id] || 0) + STEP })
  }
  const sub = (id) => {
    const next = { ...alloc }
    if (!next[id]) return
    next[id] -= STEP
    if (next[id] <= 0) delete next[id]
    onChange(next)
  }

  const subline = (id) => {
    const d = inst(id)
    if (id === 'GOVT') return `${t('govtSub')} · ${t('perYear', { pct: coupon(d.coupon, lang) })}`
    if (d.coupon) return t('perYear', { pct: coupon(d.coupon, lang) })
    if (id === 'SPY') return t('fundSpySub')
    if (id === 'SIGNET') return t('fundSignetSub')
    return SECTORS.find((x) => x.id === id)?.hint || ''
  }

  const columns = [
    { key: 'colStocks', glyph: 'stocks', ids: SECTORS.map((s) => s.id) },
    { key: 'colBonds', glyph: 'bonds', ids: BOND_IDS },
    { key: 'colFunds', glyph: 'funds', ids: FUND_IDS },
  ]

  return (
    <motion.div className="pickstage" initial="hidden" animate="show">
      <motion.div custom={0} variants={rise} className="build__head">
        <div className="build__titles">
          <h2 className="display picktitle picktitle--left">{t('buildTitle')}</h2>
          <span className="build__hint serif">{t('buildHint')}</span>
        </div>
        <div className="build__left">
          <b className={'tnum' + (left === 0 ? ' is-done' : '')}>{formatMoney(left, lang)}</b>
          <span>{t('buildLeft')}</span>
        </div>
      </motion.div>

      <motion.div custom={1} variants={rise} className="allocbar" aria-hidden="true">
        {CATALOG.filter((id) => alloc[id] > 0).map((id) => (
          <i
            key={id}
            className={`allocbar__seg is-${assetClass(id)}`}
            style={{ width: `${(alloc[id] / TOTAL) * 100}%` }}
          />
        ))}
      </motion.div>

      <motion.div custom={2} variants={rise} className="build__cols">
        {columns.map((col) => (
          <div key={col.key} className="build__col">
            <div className="build__colhead">
              <PathGlyph kind={col.glyph} className="build__colglyph" />
              <span className="kicker">{t(col.key)}</span>
              <button className="infobtn" aria-label={t(infoKey(col.glyph, 'Title'))} onClick={() => setInfo(col.glyph)}>
                ?
              </button>
            </div>
            {col.ids.map((id) => (
              <AssetCard
                key={id}
                id={id}
                amt={alloc[id] || 0}
                dim={left < STEP && !alloc[id]}
                lang={lang}
                label={assetLabel(id, t, dict)}
                sub={subline(id)}
                onAdd={add}
                onSub={sub}
              />
            ))}
          </div>
        ))}
      </motion.div>

      <motion.div custom={3} variants={rise} className="picknav">
        <button className="btn btn--ghost" onClick={onBack}>
          {t('back')}
        </button>
        <span />
        <span className="picknav__actions">
          {used > 0 && (
            <button className="btn btn--ghost" onClick={() => onChange({})}>
              {t('clear')}
            </button>
          )}
          <button className="btn btn--primary" disabled={left !== 0} onClick={onDone}>
            {t('seeResult')}
          </button>
        </span>
      </motion.div>

      <AnimatePresence>
        {info && (
          <motion.div
            className="modal-scrim"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setInfo(null)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <PathGlyph kind={info} className="modal__glyph" />
              <h4 className="display">{t(infoKey(info, 'Title'))}</h4>
              <p className="serif">{t(infoKey(info, 'Body'))}</p>
              <button className="btn btn--primary" onClick={() => setInfo(null)}>
                {t('infoClose')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
