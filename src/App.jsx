import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LangContext, useT } from './i18n.js'
import { useIdleReset, useMediaQuery } from './lib/hooks.js'
import { Logo, LangToggle } from './components/ui.jsx'
import Attract from './components/Attract.jsx'
import Builder from './components/Builder.jsx'
import Quiz from './components/Quiz.jsx'
import Result from './components/Result.jsx'

// Horizontal carousel slide between screens. dir 1 = forward, -1 = back,
// dir 0 = crossfade (used after the attract halves' expand animation, which
// already provides the motion).
const SLIDE = {
  enter: (d) => (d === 0 ? { x: '0%', opacity: 0 } : { x: d >= 0 ? '100%' : '-100%', opacity: 1 }),
  center: (d) => ({
    x: '0%',
    opacity: 1,
    transition: { duration: d === 0 ? 0.4 : 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: (d) =>
    d === 0
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { x: d >= 0 ? '-100%' : '100%', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function App() {
  const [lang, setLang] = useState('lv')
  const [phase, setPhase] = useState('attract') // attract | build | quiz | result
  const [dir, setDir] = useState(1)
  const [alloc, setAlloc] = useState({})
  const [theme, setTheme] = useState('forest') // colour variant, picked on attract

  const go = useCallback((next, d = 1) => {
    setDir(d)
    setPhase(next)
  }, [])

  const reset = useCallback(() => {
    setDir(-1)
    setPhase('attract')
    setAlloc({})
  }, [])

  // Kiosk: after inactivity, return to the attract loop for the next person.
  useIdleReset(reset, 75000, phase !== 'attract')

  const ctx = useMemo(() => ({ lang, setLang }), [lang])
  // Landscape: the app is one viewport-filling screen (the slide carousel needs
  // a fixed-height frame). Portrait phones keep the stacked, scrolling layout.
  const landscape = useMediaQuery('(min-width: 900px) and (orientation: landscape)')
  const reduce = useReducedMotion()

  // The result fills the viewport and slides in from the right like the steps.
  if (phase === 'result') {
    return (
      <LangContext.Provider value={ctx}>
        <AnimatePresence>
          <motion.div
            key="result-view"
            className={`theme-${theme}`}
            initial={reduce ? false : { x: '100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ minHeight: '100svh', background: 'var(--ink-900)' }}
          >
            <Result alloc={alloc} onPlayAgain={reset} />
          </motion.div>
        </AnimatePresence>
      </LangContext.Provider>
    )
  }

  const step =
    phase === 'attract' ? (
      <Attract onPlay={(target) => go(target, 0)} theme={theme} setTheme={setTheme} />
    ) : phase === 'quiz' ? (
      <Quiz onExit={reset} onPlaySplit={() => go('build', 1)} />
    ) : (
      <Builder alloc={alloc} onChange={setAlloc} onDone={() => go('result', 1)} onBack={reset} />
    )

  return (
    <LangContext.Provider value={ctx}>
      <Shell phase={phase} dir={dir} sliding={landscape} step={step} onHome={reset} theme={theme} />
    </LangContext.Provider>
  )
}

function Shell({ phase, dir, sliding, step, onHome, theme }) {
  const { t, lang, setLang } = useT()
  return (
    <div className={(sliding ? 'app app--dark app--fixed' : 'app app--dark') + ` theme-${theme}`}>
      <header className="app__header">
        {phase === 'attract' ? (
          <span className="brand">
            <Logo />
          </span>
        ) : (
          <button className="brand brand--link" onClick={onHome} aria-label={t('home')}>
            <Logo />
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {phase !== 'attract' && (
            <button className="homebtn" onClick={onHome}>
              {t('home')}
            </button>
          )}
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </header>

      {sliding ? (
        <main className="app__main app__main--slide">
          <AnimatePresence custom={dir} initial={false}>
            <motion.div
              key={phase}
              className="stage stage--abs"
              custom={dir}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step}
            </motion.div>
          </AnimatePresence>
        </main>
      ) : (
        <main className="app__main">
          <div className="stage">{step}</div>
        </main>
      )}

      {/* Footer height is always reserved so the slide area never shifts. */}
      <footer className="app__footer">
        {phase !== 'attract' && <span className="footnote serif">{t('disclaimer')}</span>}
      </footer>
    </div>
  )
}
