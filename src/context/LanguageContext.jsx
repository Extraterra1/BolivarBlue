import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      const isSpanish = browserLang.startsWith('es');
      const detectedLang = isSpanish ? 'es' : 'en';
      setLanguage(detectedLang);
      localStorage.setItem('language', detectedLang);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language);
      // Update html lang attribute
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = { 
    language, 
    toggleLanguage, 
    t,
    isSpanish: language === 'es',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
