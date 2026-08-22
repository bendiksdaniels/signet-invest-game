import { useEffect, useState } from 'react'
import { useT } from '../i18n.js'
import { ENDPOINT, clearLeads, flushQueue, leadsCsv, loadLeads, pendingCount } from '../lib/leads.js'

// Export panel for the e-mails collected on this device: open <url>#leads.
export default function LeadsPanel({ onClose }) {
  const { t } = useT()
  const [leads, setLeads] = useState(loadLeads)
  const [copied, setCopied] = useState(false)
  const csv = leadsCsv(leads)

  useEffect(() => {
    flushQueue()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(csv)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked: the CSV is on screen to select by hand
    }
  }
  const download = () => {
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `signet-invest-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }
  const clear = () => {
    if (!window.confirm(t('leadsClearConfirm'))) return
    clearLeads()
    setLeads([])
  }

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal leads" onClick={(e) => e.stopPropagation()}>
        <h4 className="display">{t('leadsTitle')}</h4>
        <p>
          {t('leadsCount', { n: leads.length })}
          {ENDPOINT ? ` · ${t('leadsPending', { n: pendingCount() })}` : ''}
        </p>
        <pre className="leads__csv">{leads.length ? csv : t('leadsEmpty')}</pre>
        <div className="leads__actions">
          <button className="btn btn--primary" onClick={copy} disabled={!leads.length}>
            {copied ? t('leadsCopied') : t('leadsCopy')}
          </button>
          <button className="btn btn--ghost" onClick={download} disabled={!leads.length}>
            {t('leadsDownload')}
          </button>
          <button className="btn btn--ghost" onClick={clear} disabled={!leads.length}>
            {t('leadsClear')}
          </button>
          <button className="btn btn--ghost" onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}
