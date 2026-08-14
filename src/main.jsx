import React from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted brand font (bundled + inlined by the single-file build → works
// offline on a kiosk). Montserrat per the 2026 Signet brand update.
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/400-italic.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/500-italic.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'

import './styles/tokens.css'
import './styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
