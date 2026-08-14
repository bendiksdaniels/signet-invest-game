import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useT } from '../i18n.js'
import { Arrow } from './ui.jsx'

const EASE = [0.22, 1, 0.36, 1]

// Ambient market line that keeps drawing and fading behind the question.
function AmbientLine() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <svg className="ambient" viewBox="0 0 560 64" fill="none" aria-hidden="true">
      <motion.path
        d="M4 48 L52 34 L96 44 L150 22 L204 38 L258 14 L306 30 L354 20 L402 40 L450 12 L502 24 L556 8"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.55, 0] }}
        transition={{ duration: 7, times: [0, 0.55, 1], repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
      />
    </svg>
  )
}

// The quiz's mark: a question mark drawn as a single stroke, looping like the
// market line so the two halves share one motion language.
function QuizMark() {
  const reduce = useReducedMotion()
  return (
    <svg className="quizmark" viewBox="0 0 80 112" fill="none" aria-hidden="true">
      <motion.path
        d="M18 34 C18 12, 62 10, 62 33 C62 52, 41 52, 41 70 L41 76"
        stroke="var(--accent-on-dark)"
        strokeWidth="7"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={reduce ? {} : { pathLength: [0, 1, 1] }}
        transition={{ duration: 5.4, times: [0, 0.4, 1], repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="41"
        cy="98"
        r="5.5"
        fill="var(--accent-on-dark)"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={reduce ? {} : { scale: [0, 1, 1, 1], opacity: [0, 1, 1, 1] }}
        transition={{ duration: 6.4, times: [0.35, 0.45, 0.9, 1], repeat: Infinity, ease: 'easeOut' }}
      />
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
              <AmbientLine />
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
            <QuizMark />
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
