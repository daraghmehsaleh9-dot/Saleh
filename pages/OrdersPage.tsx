import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import { Order } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface OrdersPageProps {
  onNavigate: (path: string) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const fetchedOrders = await getOrders(user.uid);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-display font-bold mb-4">{t('loginToViewOrders')}</h1>
        <p className="text-lg text-medium-text mb-8">{t('pleaseLoginToContinue')}</p>
        <button
            onClick={() => onNavigate('/login')}
            className="bg-brand-brown text-white font-bold text-lg uppercase px-8 py-4 rounded-md hover:bg-opacity-80 transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
            {t('login')}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="animate-pulse text-2xl font-bold text-medium-text">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold">{t('orderHistory')}</h1>
        <p className="text-lg text-medium-text mt-2">{t('orderHistorySubtitle')}</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center bg-light-bg p-12 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-brand-gold">{t('noOrdersYet')}</h2>
          <p className="text-medium-text mt-4">{t('noOrdersYetSubtitle')}</p>
          <button
            onClick={() => onNavigate('/products')}
            className="mt-8 bg-brand-brown text-white font-bold text-lg uppercase px-8 py-4 rounded-md hover:bg-opacity-80 transition-transform transform hover:scale-105"
          >
            {t('shopNow')}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-light-bg p-6 rounded-lg shadow-lg shadow-black/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-4 mb-4">
                <div>
                  <p className="text-sm text-medium-text">{t('orderId')}</p>
                  <p className="font-mono text-xs md:text-sm">{order.id}</p>
                </div>
                <div className="mt-2 md:mt-0 md:text-right">
                  <p className="text-sm text-medium-text">{t('date')}</p>
                  <p className="font-bold">{formatDate(order.date)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h3 className="font-bold mb-2 text-brand-gold">{t('items')}</h3>
                    <ul className="space-y-2 text-sm">
                        {order.items.map(item => (
                            <li key={item.id} className="flex justify-between">
                                <span>{item.name[language]} <span className="text-medium-text">x {item.quantity}</span></span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-2 text-brand-gold">{t('shippedTo')}</h3>
                    <div className="text-sm text-medium-text">
                        <p>{order.deliveryDetails.fullName}</p>
                        <p>{order.deliveryDetails.address}</p>
                        <p>{order.deliveryDetails.city}</p>
                    </div>
                     <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                        <span className="font-bold text-lg">{t('total')}</span>
                        <span className="font-bold text-xl text-brand-gold">${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;