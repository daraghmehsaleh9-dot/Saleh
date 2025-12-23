import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { language, t } = useLanguage();
  const { addToCart, setBuyNowItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setBuyNowItem({ ...product, quantity: 1 });
    onNavigate('/checkout');
  };

  return (
    <div 
      className="bg-light-bg rounded-lg overflow-hidden shadow-lg shadow-black/30 flex flex-col group transition-all duration-300 hover:shadow-brand-gold/30 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
      onClick={() => onNavigate(`/products/${product.id}`)}
    >
      <div className="relative overflow-hidden">
        <img src={product.imageUrl} alt={product.name[language]} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-0 left-0 bg-brand-brown text-dark-bg px-3 py-1 m-2 rounded-full text-sm font-bold">
            {product.category[language]}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-display font-bold text-light-text mb-2">{product.name[language]}</h3>
        <p className="text-medium-text text-sm flex-grow mb-4">{product.description[language]}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-3xl font-display font-bold text-brand-gold">{product.price.toFixed(2)} {t('currency')}</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAddToCart}
              disabled={isAdded}
              className="bg-dark-bg border-2 border-brand-brown text-brand-brown font-bold px-4 py-2 rounded-full hover:bg-brand-brown hover:text-dark-bg transition-all duration-300 disabled:bg-brand-gold disabled:border-brand-gold disabled:text-dark-bg text-sm whitespace-nowrap"
            >
              {isAdded ? t('added') : t('addToCart')}
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-brand-brown text-dark-bg font-bold px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors text-sm whitespace-nowrap"
            >
              {t('buyNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;