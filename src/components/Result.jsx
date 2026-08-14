import { motion } from 'framer-motion'
import { useT } from '../i18n.js'
import { AnimatedNumber, Logo, LangToggle } from './ui.jsx'
import { MoneyChart, CompareBars } from './charts.jsx'
import {
  inst, isBond, assetClass, assetLabel, bestWorstMonth, portfolioSeries,
  COMPARE_SET, CATALOG, MONTHS, BOND_FREQ, TOTAL,
} from '../lib/gamedata.js'
import { formatMoney, formatPct } from '../lib/format.js'

const FUND_URL = 'https://signetbank.com/en/where-to-invest/signet-baltic-bond-fund/'
const EASE = [0.22, 1, 0.36, 1]

export default function Result({ alloc, onPlayAgain }) {
  const { t, lang, setLang, dict } = useT()
  const ids = CATALOG.filter((id) => alloc[id] > 0)
  const single = ids.length === 1
  const values = portfolioSeries(alloc)
  const finalValue = values[values.length - 1]
  const ret = (finalValue / TOTAL - 1) * 100
  const name = single ? assetLabel(ids[0], t, dict, { long: true }) : t('yourPortfolio')
  const allBonds = ids.every(isBond)
  const signetOnly = single && ids[0] === 'SIGNET'
  const hasSignet = (alloc.SIGNET || 0) > 0

  const rows = [
    { id: 'you', label: name, ret, you: true, fund: signetOnly },
    ...COMPARE_SET.filter((id) => !(single && id === ids[0])).map((id) => ({
      id,
      label: assetLabel(id, t, dict, { long: true }),
      ret: inst(id).ret,
      fund: id === 'SIGNET',
    })),
  ]

  const stats =
    single && isBond(ids[0])
      ? [
          {
            v: formatPct(inst(ids[0]).coupon, lang, { signed: false, decimals: inst(ids[0]).coupon % 1 ? 1 : 0 }),
            s: t('statCoupon'),
          },
          { v: t(BOND_FREQ[ids[0]]), s: t('statFreq') },
        ]
      : (() => {
          const { best, worst } = bestWorstMonth(values)
          return [
            { v: formatPct(best, lang), s: t('statBest') },
            { v: formatPct(worst, lang), s: t('statWorst') },
          ]
        })()

  return (
    <div className="result">
      <div className="result__left">
        <div className="result__top">
          <span className="brand">
            <Logo />
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="kicker" style={{ fontSize: 'var(--label-md)' }}>
              {t('resultKicker')}
            </span>
            <button className="homebtn" onClick={onPlayAgain}>
              {t('home')}
            </button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>

        <div className="result__hero">
          <span className="result__headline">{t('resultHeadline')}</span>
          <div className="result__valuerow">
            <AnimatedNumber
              className="display result__display tnum"
              value={finalValue}
              format={(v) => formatMoney(v, lang)}
            />
            <motion.span
              className={'retbadge tnum ' + (ret >= 0 ? 'is-pos' : 'is-neg')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.4, ease: EASE }}
            >
              {formatPct(ret, lang)}
            </motion.span>
          </div>
          <span className="result__pickname serif">{name}</span>

          <div className="result__chartwrap">
            <MoneyChart
              values={values}
              months={MONTHS}
              lang={lang}
              kind={allBonds ? 'steps' : 'line'}
              benchmark={signetOnly ? null : inst('SIGNET').values}
              benchmarkLabel={t('benchmarkLabel')}
            />
          </div>
        </div>

        <div className="result__strip">
          <div className="result__stat">
            <b className="tnum">{formatMoney(TOTAL, lang)}</b>
            <span>{t('statStart')}</span>
          </div>
          {stats.map((s) => (
            <div key={s.s} className="result__stat">
              <b className="tnum">{s.v}</b>
              <span>{s.s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="result__right">
        <h3 className="display result__comparetitle">{t('breakdownTitle')}</h3>
        <div className="breakdown">
          {ids.map((id, i) => {
            const endVal = (inst(id).values[MONTHS.length - 1] * alloc[id]) / TOTAL
            const r = inst(id).ret
            return (
              <motion.div
                key={id}
                className="breakdown__row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: EASE }}
              >
                <i className={`breakdown__dot is-${assetClass(id)}`} />
                <span className="breakdown__label">{assetLabel(id, t, dict)}</span>
                <span className="breakdown__alloc tnum">{formatMoney(alloc[id], lang)}</span>
                <span className="breakdown__arrow" aria-hidden="true">→</span>
                <span className="breakdown__end tnum">{formatMoney(endVal, lang)}</span>
                <span className={'breakdown__ret tnum ' + (r >= 0 ? 'is-pos' : 'is-neg')}>{formatPct(r, lang)}</span>
              </motion.div>
            )
          })}
        </div>

        <hr className="rule" />

        <h3 className="display result__comparetitle result__comparetitle--tight">{t('compareTitle')}</h3>
        <CompareBars rows={rows} lang={lang} />

        <motion.div
          className="fundpanel"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5, ease: EASE }}
        >
          <div className="fundpanel__head">
            <b>{t('fundPanelTitle')}</b>
            <span className="fundpanel__stat tnum">{t('fundPanelStat')}</span>
          </div>
          <p className="serif fundpanel__body">{hasSignet ? t('fundPanelBodyPicked') : t('fundPanelBody')}</p>
        </motion.div>

        <div className="result__cta">
          <a className="btn btn--primary" href={FUND_URL} target="_blank" rel="noreferrer">
            {t('fundCta')}
          </a>
          <button className="btn btn--ghost" onClick={onPlayAgain}>
            {t('playAgain')}
          </button>
        </div>

        <p className="result__disclaimer serif">{t('disclaimer')}</p>
      </div>
    </div>
  )
}
