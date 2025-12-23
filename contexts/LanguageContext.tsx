import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [translations, setTranslations] = useState<{ [key: string]: { [key: string]: string } } | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [arResponse, enResponse] = await Promise.all([
          fetch('./locales/ar.json'),
          fetch('./locales/en.json')
        ]);
        if (!arResponse.ok || !enResponse.ok) {
            throw new Error('Failed to load translation files');
        }
        const arData = await arResponse.json();
        const enData = await enResponse.json();
        setTranslations({ ar: arData, en: enData });
      } catch (error) {
        console.error('Error fetching translations:', error);
        // Set empty translations to prevent app crash
        setTranslations({ ar: {}, en: {} });
      }
    };
    fetchTranslations();
  }, []);

  const t = (key: string): string => {
    if (!translations || !translations[language]) {
      return key;
    }
    return translations[language][key] || key;
  };

  if (!translations) {
    // Render nothing or a loading spinner while translations are loading
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
