import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
document.title = 'PARALLEL';

const setFavicon = (mode) => {
  const link = document.querySelector("link[rel~='icon']");
  if (link) {
      link.href = mode === 'light' ? '/src/assets/parallel_icon_black.png' : '/src/assets/parallel_icon_white.png';
  }
};

const updateFaviconBasedOnColorScheme = () => {
  const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
  setFavicon(isLightMode ? 'light' : 'dark');
};

updateFaviconBasedOnColorScheme();

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', updateFaviconBasedOnColorScheme);