import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 rounded-md hover:bg-gray-700/50 transition-colors font-bold text-medium-text hover:text-light-text"
            aria-label={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
        >
            {language === 'ar' ? 'EN' : 'AR'}
        </button>
    );
};

export default LanguageSwitcher;
