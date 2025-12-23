import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface NotFoundPageProps {
    onNavigate: (path: string) => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-9xl font-display font-bold text-brand-brown">404</h1>
        <h2 className="text-4xl font-bold mt-4">{t('pageNotFound')}</h2>
        <p className="text-lg text-medium-text mt-4 max-w-md">{t('pageNotFoundSubtitle')}</p>
        <button
            onClick={() => onNavigate('/')}
            className="mt-8 bg-brand-brown text-dark-bg font-bold text-lg uppercase px-8 py-4 rounded-md hover:bg-opacity-80 transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
            {t('goBackHome')}
        </button>
    </div>
  );
};

export default NotFoundPage;