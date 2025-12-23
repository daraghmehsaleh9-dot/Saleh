import React from 'react';
import { MOCK_BRANDS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const BrandsPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
       <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold">{t('ourPartners')}</h1>
        <p className="text-lg text-medium-text mt-2">{t('brandsSubtitle')}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {MOCK_BRANDS.map(brand => (
          <div key={brand.name} className="bg-light-bg p-6 rounded-lg flex justify-center items-center h-40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-gold/20 border-2 border-transparent hover:border-brand-gold">
            <img src={brand.logoUrl} alt={brand.name} className="max-h-12 max-w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage;