// Lead capture behind the e-mail gate. Every lead is kept on the device
// (localStorage) so nothing is lost on an offline kiosk; export them by opening
// <url>#leads. When a collector URL is baked in at build time
// (VITE_LEADS_ENDPOINT) each lead is also POSTed there, and unsent ones stay
// queued for the next try.
const KEY = 'signet-invest-leads'
const QUEUE_KEY = 'signet-invest-leads-queue'
const MAX = 5000

export const ENDPOINT = (import.meta.env.VITE_LEADS_ENDPOINT || '').trim()

function read(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function write(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list.slice(-MAX)))
  } catch {
    // storage blocked or full: the game must keep going regardless
  }
}

export function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim())
}

export function loadLeads() {
  return read(KEY)
}

export function pendingCount() {
  return read(QUEUE_KEY).length
}

// lead: { email, lang, alloc, final, ret }
export function saveLead(lead) {
  const rec = { ts: new Date().toISOString(), ...lead }
  write(KEY, [...read(KEY), rec])
  if (ENDPOINT) {
    write(QUEUE_KEY, [...read(QUEUE_KEY), rec])
    flushQueue()
  }
  return rec
}

// Send queued leads in order; the first failure stops the run and everything
// from it on stays queued.
let flushing = false
export async function flushQueue() {
  if (!ENDPOINT || flushing) return
  flushing = true
  try {
    let queue = read(QUEUE_KEY)
    while (queue.length) {
      if (!(await post(queue[0]))) break
      queue = queue.slice(1)
      write(QUEUE_KEY, queue)
    }
  } finally {
    flushing = false
  }
}

async function post(rec) {
  try {
    // text/plain keeps the request "simple" (no CORS preflight), which is what
    // Google Apps Script and most tiny collectors expect.
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(rec),
      keepalive: true,
    })
    return res.ok
  } catch {
    return false
  }
}

export function clearLeads() {
  try {
    localStorage.removeItem(KEY)
    localStorage.removeItem(QUEUE_KEY)
  } catch {
    // nothing to clear
  }
}

const cell = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function leadsCsv(leads = loadLeads()) {
  const head = 'timestamp,email,lang,final_eur,return_pct,allocation'
  const rows = leads.map((l) =>
    [
      l.ts,
      l.email,
      l.lang,
      l.final,
      l.ret,
      Object.entries(l.alloc || {})
        .map(([k, v]) => `${k}:${v}`)
        .join(';'),
    ]
      .map(cell)
      .join(',')
  )
  return [head, ...rows].join('\n') + '\n'
}
