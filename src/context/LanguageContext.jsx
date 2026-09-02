import { createContext, useContext, useState, useEffect } from 'react';
import { languages, translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_lang');
      if (saved && translations[saved]) return saved;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Translation function t(key)
  const t = (key) => {
    const langDict = translations[lang] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
