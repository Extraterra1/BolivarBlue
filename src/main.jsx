import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './context/LanguageContext';
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh');
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HeroUIProvider>
  </StrictMode>,
);
