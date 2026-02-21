import { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from './translations';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('fanpass_lang');
    if (saved && ['en', 'de'].includes(saved)) {
      return saved;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'de') {
      return 'de';
    }
    
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('fanpass_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (path) => getTranslation(language, path);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'de' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
