import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { updateOrderStatus } from '../services/orderService';
import { useCart } from '../contexts/CartContext';

interface PaymentSuccessPageProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-brand-gold" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onNavigate, currentPath }) => {
  const { t } = useLanguage();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(currentPath.split('?')[1]);
    const currentOrderId = params.get('orderId');

    if (currentOrderId) {
      setOrderId(currentOrderId);
      updateOrderStatus(currentOrderId, 'paid')
        .then(() => {
          console.log(`Order ${currentOrderId} successfully marked as paid.`);
          clearCart();
        })
        .catch(error => {
          console.error(`Failed to update order ${currentOrderId}:`, error);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    } else {
        setIsUpdating(false);
    }
  }, [currentPath, clearCart]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center min-h-[70vh] flex flex-col justify-center items-center">
      <SuccessIcon />
      <h1 className="text-4xl font-display font-bold mt-6 mb-4">{t('paymentSuccess')}</h1>
      <p className="text-lg text-medium-text max-w-md mb-8">{t('thankYouForYourOrder')}</p>
      {isUpdating && <div className="animate-pulse text-medium-text mb-4">Finalizing your order...</div>}
      {orderId && !isUpdating && (
        <div className="bg-light-bg p-4 rounded-lg mb-8 shadow-lg">
            <p className="text-medium-text">{t('orderId')}: <span className="font-mono text-light-text">{orderId}</span></p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onNavigate('/')}
          className="bg-brand-brown text-dark-bg font-bold text-lg uppercase px-8 py-4 rounded-md hover:bg-opacity-80 transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
          {t('backToHome')}
        </button>
        <button
          onClick={() => onNavigate('/profile')}
          className="bg-gray-700 text-light-text font-bold text-lg uppercase px-8 py-4 rounded-md hover:bg-gray-600 transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
          {t('viewMyProfile')}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;