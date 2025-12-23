import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { t, language } = useLanguage();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-display font-bold mb-4">{t('cartIsEmpty')}</h1>
        <p className="text-lg text-medium-text mb-8">{t('cartIsEmptySubtitle')}</p>
        <button
          onClick={() => onNavigate('/products')}
          className="bg-brand-brown text-dark-bg font-bold text-lg uppercase px-8 py-4 rounded-md hover:bg-opacity-80 transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-display font-bold text-center mb-12">{t('shoppingCart')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-light-bg p-6 rounded-lg shadow-lg shadow-black/20">
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-700 last:border-b-0">
                <img src={item.imageUrl} alt={item.name[language]} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-grow">
                  <h2 className="font-bold text-lg">{item.name[language]}</h2>
                  <p className="text-medium-text">{item.price.toFixed(2)} {t('currency')}</p>
                </div>
                <div className="flex items-center border border-gray-600 rounded-md">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 font-bold hover:bg-dark-bg">-</button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 font-bold hover:bg-dark-bg">+</button>
                </div>
                <p className="font-bold w-24 text-center">{(item.price * item.quantity).toFixed(2)} {t('currency')}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 font-bold">
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-light-bg p-8 rounded-lg shadow-lg shadow-black/20 h-fit">
          <h2 className="text-2xl font-bold mb-6">{t('orderSummary')}</h2>
          <div className="flex justify-between items-center mb-6 text-lg">
            <span>{t('subtotal')}</span>
            <span className="font-bold text-brand-gold">{totalPrice.toFixed(2)} {t('currency')}</span>
          </div>
          <button
            onClick={() => onNavigate('/checkout')}
            className="w-full bg-brand-brown text-dark-bg font-bold p-4 rounded-md hover:bg-opacity-80 transition-colors uppercase text-lg"
          >
            {t('proceedToCheckout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;