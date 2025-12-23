import React from 'react';
import { Product } from '../types';
import ProductGrid from '../components/ProductGrid';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductsPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onNavigate: (path: string) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products, setProducts, onNavigate }) => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-4 sm-px-6 lg:px-8 py-16 min-h-[60vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold">{t('allOurProducts')}</h1>
        <p className="text-lg text-medium-text mt-2">{t('productsSubtitle')}</p>
      </div>
      {/* The ProductGrid component is reused here */}
      <ProductGrid products={products} setProducts={setProducts} onNavigate={onNavigate} />
    </div>
  );
};

export default ProductsPage;