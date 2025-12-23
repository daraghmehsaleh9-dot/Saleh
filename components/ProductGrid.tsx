import React, { useState } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { CATEGORIES, MOCK_PRODUCTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductGridProps {
    products: Product[];
    setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
    onNavigate: (path: string) => void;
    showFilters?: boolean;
    title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
    products, 
    setProducts, 
    onNavigate, 
    showFilters = true,
    title
}) => {
    const { language, t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('All');
    
    const currentCategories = CATEGORIES[language];

    const handleFilter = (category: string) => {
        if (!setProducts) return;
        setActiveCategory(category);
        if (category === 'All') {
            setProducts(MOCK_PRODUCTS);
        } else {
            setProducts(MOCK_PRODUCTS.filter(p => p.category[language] === category));
        }
    };

    return (
        <div id="products" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-4xl font-display font-bold text-center mb-4">
                {title || t('ourFlavors')}
            </h2>
            
            {showFilters && (
                <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                    <button
                        onClick={() => handleFilter('All')}
                        className={`px-4 py-2 font-bold rounded-full transition-colors ${activeCategory === 'All' ? 'bg-brand-brown text-dark-bg' : 'bg-light-bg text-medium-text hover:bg-gray-700'}`}
                    >
                        {t('all')}
                    </button>
                    {currentCategories.map(category => (
                        <button
                            key={category}
                            onClick={() => handleFilter(category)}
                            className={`px-4 py-2 font-bold rounded-full transition-colors ${activeCategory === category ? 'bg-brand-brown text-dark-bg' : 'bg-light-bg text-medium-text hover:bg-gray-700'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-bold text-medium-text">{t('noProductsFound')}</h3>
                    <p className="text-gray-500 mt-2">{t('noProductsFoundSubtitle')}</p>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;