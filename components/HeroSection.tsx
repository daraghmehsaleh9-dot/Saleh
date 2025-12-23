import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://storage.googleapis.com/aymand/products/back1.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/55"></div>
      </div>
      <div className="relative z-10 px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-wider leading-tight">
          <span className="text-brand-brown block md:inline">{t('heroTitlePrefix')}</span> {t('heroTitleSuffix')}
        </h1>
        <p className="mt-8 max-w-4xl mx-auto text-lg md:text-2xl text-medium-text leading-relaxed font-light">
          {t('heroSubtitle')}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;