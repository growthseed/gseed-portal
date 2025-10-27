import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'
import './index.css'
import './i18n/config' // Sistema de internacionalização

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
