import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useT, QUIZ } from '../i18n.js'
import { rise } from './ui.jsx'

const EASE = [0.22, 1, 0.36, 1]
const sub = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.22, ease: [0.65, 0, 0.35, 1] } },
}

// Five quick questions about the Baltic capital market. Every answer teaches
// one fact; the score screen hands the visitor over to the split game.
export default function Quiz({ onExit, onPlaySplit }) {
  const { t, lang } = useT()
  const questions = QUIZ[lang] || QUIZ.lv
  const total = questions.length
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[qi]
  const answered = picked != null

  const pick = (i) => {
    if (answered) return
    setPicked(i)
    if (i === q.correct) setScore((s) => s + 1)
  }
  const next = () => {
    if (qi + 1 >= total) {
      setDone(true)
      return
    }
    setQi(qi + 1)
    setPicked(null)
  }
  const restart = () => {
    setQi(0)
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  const band = score <= 2 ? 0 : score <= 4 ? 1 : 2

  if (done) {
    return (
      <motion.div className="quiz" initial="hidden" animate="show">
        <motion.span custom={0} variants={rise} className="kicker">
          {t('quizKicker')}
        </motion.span>
        <motion.span custom={1} variants={rise} className="quiz__scorelabel">
          {t('quizScoreLabel')}
        </motion.span>
        <motion.b custom={2} variants={rise} className="display quiz__score tnum">
          {score}/{total}
        </motion.b>
        <motion.h2 custom={3} variants={rise} className="display quiz__band">
          {t('quizTitle' + band)}
        </motion.h2>
        <motion.p custom={4} variants={rise} className="serif quiz__outro">
          {t('quizOutro' + band)}
        </motion.p>
        <motion.div custom={5} variants={rise} className="quiz__endnav">
          <button className="btn btn--primary" onClick={onPlaySplit}>
            {t('quizTrySplit')}
          </button>
          <button className="btn btn--ghost" onClick={restart}>
            {t('quizAgain')}
          </button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div className="quiz" initial="hidden" animate="show">
      <motion.span custom={0} variants={rise} className="kicker">
        {t('quizQn', { n: qi + 1, total })}
      </motion.span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={qi} className="quiz__body" variants={sub} initial="initial" animate="animate" exit="exit">
          <h2 className="display quiz__q">{q.q}</h2>

          <div className="quiz__opts">
            {q.options.map((opt, i) => {
              let cls = 'qopt'
              if (answered) {
                if (i === q.correct) cls += ' is-correct'
                else if (i === picked) cls += ' is-wrong'
                else cls += ' is-off'
              }
              return (
                <button key={opt} className={cls} onClick={() => pick(i)}>
                  {opt}
                </button>
              )
            })}
          </div>

          <div className="quiz__factwrap">
            {answered && (
              <motion.p
                className="serif quiz__fact"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {q.fact}
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="picknav">
        <button className="btn btn--ghost" onClick={onExit}>
          {t('back')}
        </button>
        <span />
        <span className="picknav__actions">
          <button className="btn btn--primary" disabled={!answered} onClick={next}>
            {qi + 1 >= total ? t('quizFinish') : t('quizNext')}
          </button>
        </span>
      </div>
    </motion.div>
  )
}
