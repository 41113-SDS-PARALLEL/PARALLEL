import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
document.title = 'PARALLEL';
// const link = document.createElement('link');
// link.rel = 'icon';
// link.href = './assets/parallel_logo_mini.png';
// document.head.appendChild(link);