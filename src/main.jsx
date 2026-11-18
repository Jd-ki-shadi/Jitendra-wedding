import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/rozha-one'
import '@fontsource/yatra-one'
import '@fontsource/tiro-devanagari-hindi/400.css'
import '@fontsource/tiro-devanagari-hindi/400-italic.css'
import '@fontsource/kalam/400.css'
import '@fontsource/kalam/700.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
