import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n.js'
import { Arrow } from './ui.jsx'

const EASE = [0.22, 1, 0.36, 1]

// Static market line under the question: quiet, no motion.
function MarketLine() {
  return (
    <svg className="ambient" viewBox="0 0 560 64" fill="none" aria-hidden="true">
      <path
        d="M4 48 L52 34 L96 44 L150 22 L204 38 L258 14 L306 30 L354 20 L402 40 L450 12 L502 24 L556 8"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx="556" cy="8" r="4" fill="var(--accent-on-dark)" />
    </svg>
  )
}

// The quiz's mark: a serif question mark inside a thin double ring, like a
// signet seal. Static, on brand.
function QuizSeal() {
  return (
    <svg className="quizmark" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="45" stroke="var(--gold-500)" strokeWidth="1.5" />
      <circle cx="48" cy="48" r="39" stroke="var(--gold-500)" strokeWidth="0.75" opacity="0.55" />
      <text
        x="48"
        y="66"
        textAnchor="middle"
        fill="var(--accent-on-dark)"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontSize="52"
        fontWeight="600"
      >
        ?
      </text>
    </svg>
  )
}

// Split-screen chooser: the 10k game on the left, the quiz on the right.
// Tapping a half expands it across the whole stage, then the game fades in.
export default function Attract({ onPlay }) {
  const { t } = useT()
  const reduce = useReducedMotion()
  const [chosen, setChosen] = useState(null) // null | 'build' | 'quiz'

  const pick = (target) => {
    if (chosen) return
    if (reduce) {
      onPlay(target)
      return
    }
    setChosen(target)
    setTimeout(() => onPlay(target), 520)
  }

  const half = (target) => ({
    animate: chosen ? { flexGrow: chosen === target ? 1 : 0.0001, opacity: chosen === target ? 1 : 0 } : { flexGrow: 1, opacity: 1 },
    transition: { duration: 0.5, ease: EASE },
  })
  const content = (target) => ({
    animate: chosen ? { opacity: 0, scale: chosen === target ? 1.05 : 0.94 } : { opacity: 1, scale: 1 },
    transition: { duration: chosen === target ? 0.5 : 0.3, ease: EASE },
  })

  return (
    <div className="split">
      <motion.button className="split__half split__half--game" onClick={() => pick('build')} {...half('build')}>
        <motion.span className="split__inner" {...content('build')}>
          <span className="kicker">{t('gameKicker')}</span>
          <span className="split__motif">
            <span className="split__ambient">
              <MarketLine />
            </span>
          </span>
          <span className="display split__title">
            <span style={{ display: 'block' }}>{t('attractTitle1')}</span>
            <span style={{ display: 'block', color: 'var(--accent-on-dark)' }}>{t('attractTitle2')}</span>
          </span>
          <span className="serif split__sub">{t('attractSub')}</span>
          <span className="btn btn--ghost split__cta">
            {t('play')}
            <Arrow />
          </span>
        </motion.span>
      </motion.button>

      <motion.i
        className="split__divider"
        aria-hidden="true"
        animate={{ opacity: chosen ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      />

      <motion.button className="split__half split__half--quiz" onClick={() => pick('quiz')} {...half('quiz')}>
        <motion.span className="split__inner" {...content('quiz')}>
          <span className="kicker">{t('quizKicker')}</span>
          <span className="split__motif">
            <QuizSeal />
          </span>
          <span className="display split__title">{t('playQuiz')}</span>
          <span className="serif split__sub">{t('quizPanelSub')}</span>
          <span className="btn btn--ghost split__cta">
            {t('play')}
            <Arrow />
          </span>
        </motion.span>
      </motion.button>
    </div>
  )
}
