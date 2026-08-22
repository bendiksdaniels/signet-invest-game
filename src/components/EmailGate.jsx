import { useState } from 'react'
import { motion } from 'framer-motion'
import { useT } from '../i18n.js'
import { rise } from './ui.jsx'
import { isValidEmail } from '../lib/leads.js'

// The lead gate between the builder and the result: e-mail + consent, then the
// result. The muted skip link keeps the consent freely given; remove it (and
// onSkip) for a hard gate.
export default function EmailGate({ onSubmit, onSkip, onBack }) {
  const { t } = useT()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [touched, setTouched] = useState(false)
  const valid = isValidEmail(email)
  const showError = touched && email.trim().length > 0 && !valid

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!valid || !consent) return
    onSubmit(email.trim().toLowerCase())
  }

  return (
    <motion.form className="gate" initial="hidden" animate="show" onSubmit={submit} noValidate>
      <motion.span custom={0} variants={rise} className="kicker">
        {t('gateKicker')}
      </motion.span>
      <motion.h2 custom={1} variants={rise} className="display gate__title">
        {t('gateTitle')}
      </motion.h2>
      <motion.p custom={2} variants={rise} className="serif gate__sub">
        {t('gateSub')}
      </motion.p>

      <motion.div custom={3} variants={rise} className="field">
        <label className="field__label" htmlFor="gate-email">
          {t('gateLabel')}
        </label>
        <input
          id="gate-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoFocus
          placeholder={t('gatePlaceholder')}
          value={email}
          className={showError ? 'is-invalid' : ''}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        <span className="gate__error" role="alert">
          {showError ? t('gateInvalid') : ''}
        </span>
        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>{t('gateConsent')}</span>
        </label>
      </motion.div>

      <motion.div custom={4} variants={rise} className="picknav">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          {t('back')}
        </button>
        <span />
        <span className="picknav__actions">
          <button type="button" className="btn btn--ghost gate__skip" onClick={onSkip}>
            {t('gateSkip')}
          </button>
          <button type="submit" className="btn btn--primary" disabled={!valid || !consent}>
            {t('seeResult')}
          </button>
        </span>
      </motion.div>
    </motion.form>
  )
}
