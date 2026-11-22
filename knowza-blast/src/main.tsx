import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (!import.meta.env.DEV && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL || '/'}sw.js`;
    navigator.serviceWorker.register(swPath).catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
