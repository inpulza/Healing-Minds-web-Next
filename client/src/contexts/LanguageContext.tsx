import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useLocation } from '@/lib/navigation';
import { hasBilingualCounterpart } from '../utils/urlMapping';
import { translations } from '../data/translations';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage = 'en',
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [location] = useLocation();

  // URL-driven language sync: automatically set language based on current URL
  // Only for pages with bilingual counterparts to preserve manual language selection
  useEffect(() => {
    if (hasBilingualCounterpart(location)) {
      const urlLanguage = location.startsWith('/es') ? 'es' : 'en';
      if (urlLanguage !== language) {
        setLanguage(urlLanguage);
      }
    }
  }, [location, language]);


  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
