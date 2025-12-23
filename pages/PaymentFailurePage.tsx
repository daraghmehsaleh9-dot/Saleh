import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { updateOrderStatus } from '../services/orderService';

interface PaymentFailurePageProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

const FailureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const PaymentFailurePage: React.FC<PaymentFailurePageProps> = ({ onNavigate, currentPath }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(currentPath.split('?')[1]);
    const orderId = params.get('orderId');

    if (orderId) {
      updateOrderStatus(orderId, 'failed').catch(error => {
        console.error(`Failed to update order ${orderId} status to failed:`, error);
      });
    }
  }, [currentPath]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center min-h-[70vh] flex flex-col justify-center items-center">
      <FailureIcon />
      <h1 className="text-4xl font-display font-bold mt-6 mb-4">{t('paymentFailed')}</h1>
      <p className="text-lg text-medium-text max-w-md mb-8">{t('paymentFailedSubtitle')}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
            onClick={() => onNavigate('/checkout')}
            className="bg-brand-brown text-dark-bg font-bold text-lg uppercase px-8 py-4 rounded-md hover:bg-opacity-80 transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
            {t('tryAgain')}
        </button>
        <button
            onClick={() => onNavigate('/')}
            className="bg-gray-700 text-light-text font-bold text-lg uppercase px-8 py-4 rounded-md hover:bg-gray-600 transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
            {t('backToHome')}
        </button>
      </div>
    </div>
  );
};

export default PaymentFailurePage;