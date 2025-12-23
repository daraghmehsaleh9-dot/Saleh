import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FlavorFinder: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-light-bg py-12 -mt-16 relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-bg p-8 rounded-lg shadow-2xl shadow-black/30">
          <h2 className="text-3xl font-display font-bold text-center mb-6 text-brand-gold">{t('findYourFlavor')}</h2>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col">
              <label htmlFor="chocolateType" className="mb-2 font-bold text-medium-text">{t('chocolateType')}</label>
              <select id="chocolateType" className="bg-light-bg border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold">
                <option>{t('all')}</option>
                <option>{t('darkChocolate')}</option>
                <option>{t('milkChocolate')}</option>
                <option>{t('whiteChocolate')}</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="filling" className="mb-2 font-bold text-medium-text">{t('filling')}</label>
              <select id="filling" className="bg-light-bg border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold">
                <option>{t('all')}</option>
                <option>{t('caramel')}</option>
                <option>{t('nuts')}</option>
                <option>{t('fruit')}</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="occasion" className="mb-2 font-bold text-medium-text">{t('occasion')}</label>
              <select id="occasion" className="bg-light-bg border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold">
                <option>{t('all')}</option>
                <option>{t('gift')}</option>
                <option>{t('celebration')}</option>
                <option>{t('treatYourself')}</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-brand-brown text-white font-bold p-3 rounded-md hover:bg-opacity-80 transition-colors h-[52px]">
              {t('search')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlavorFinder;