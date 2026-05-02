import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  // Static UI translation function
  const t = (key) => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  // Backend dynamic translation function (for Gemini Chat)
  const translateDynamic = async (text, targetLangCode) => {
    if (targetLangCode === 'en' || !text) return text;
    const targetLabel = LANGUAGES.find(l => l.code === targetLangCode)?.label || 'Hindi';
    
    try {
      const apiUrl = import.meta.env.PROD 
        ? '/_/backend/api/translate' 
        : 'http://localhost:5000/api/translate';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: targetLabel })
      });
      const data = await res.json();
      return data.translatedText || text;
    } catch (e) {
      console.error("Dynamic translation error", e);
      return text;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translateDynamic, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
