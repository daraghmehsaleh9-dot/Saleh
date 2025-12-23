import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface ProductDetailPageProps {
  productId: number;
  onNavigate: (path: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const { language, t } = useLanguage();
  const { addToCart, setBuyNowItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = MOCK_PRODUCTS.find(p => p.id === productId);

  if (!product) {
    return (
        <div className="text-center py-32 container mx-auto">
            <h1 className="text-4xl font-bold text-brand-brown">{t('productNotFound')}</h1>
            <p className="text-medium-text mt-4">{t('productNotFoundSubtitle')}</p>
        </div>
    );
  }
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setBuyNowItem({ ...product, quantity });
    onNavigate('/checkout');
  };

  const relatedProducts = MOCK_PRODUCTS.filter(p => p.category[language] === product.category[language] && p.id !== product.id).slice(0, 3);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <img src={product.imageUrl} alt={product.name[language]} className="w-full rounded-lg shadow-lg shadow-black/30" />
            </div>
            <div className="flex flex-col">
                <span className="text-brand-brown font-bold mb-2 uppercase tracking-wider">{product.category[language]}</span>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{product.name[language]}</h1>
                <p className="text-medium-text text-lg mb-6">{product.description[language]}</p>
                <div className="flex items-center justify-between mb-8">
                    <p className="text-5xl font-display font-bold text-brand-gold">{product.price.toFixed(2)} {t('currency')}</p>
                </div>
                 <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center border border-gray-700 rounded-md">
                        <button onClick={() => handleQuantityChange(-1)} className="px-4 py-3 font-bold hover:bg-light-bg transition-colors">-</button>
                        <span className="px-4 py-3 bg-dark-bg w-12 text-center">{quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} className="px-4 py-3 font-bold hover:bg-light-bg transition-colors">+</button>
                    </div>
                    <div className="flex-grow flex items-center gap-2 w-full">
                        <button 
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className="w-full bg-dark-bg border-2 border-brand-brown text-brand-brown font-bold px-6 py-3 rounded-md hover:bg-brand-brown hover:text-dark-bg transition-all duration-300 disabled:bg-brand-gold disabled:border-brand-gold disabled:text-dark-bg uppercase"
                        >
                            {isAdded ? t('added') : t('addToCart')}
                        </button>
                         <button 
                            onClick={handleBuyNow}
                            className="w-full bg-brand-brown text-dark-bg font-bold px-6 py-3 rounded-md hover:bg-opacity-80 transition-colors uppercase"
                        >
                            {t('buyNow')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {relatedProducts.length > 0 && (
            <div className="mt-24">
                <h2 className="text-3xl font-display font-bold text-center mb-8">{t('relatedFlavors')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default ProductDetailPage;