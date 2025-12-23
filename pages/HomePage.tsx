import React from 'react';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import { MOCK_PRODUCTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  
  // Use a fixed set of 4 featured products for the landing page
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  
  return (
    <>
      <HeroSection />
      <div className="relative">
        <ProductGrid 
          products={featuredProducts} 
          onNavigate={onNavigate}
          showFilters={false}
          title={t('ourFlavors')}
        />
        <div className="container mx-auto px-4 text-center -mt-8 mb-16">
          <button
            onClick={() => onNavigate('/products')}
            className="inline-block bg-brand-gold text-dark-bg font-bold text-lg uppercase px-10 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-brand-gold/20"
          >
            {t('shopNow')}
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;