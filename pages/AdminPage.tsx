import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { Order } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch all orders:", err);
        setError("Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      // Optional: Add a success notification
    } catch (err) {
      console.error("Failed to update order status:", err);
      // Optional: Add an error notification
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const statusOptions: Order['status'][] = ['pending', 'paid', 'in progress', 'in delivery', 'delivered', 'failed'];
  
  const statusColors: { [key in Order['status']]: string } = {
    paid: 'bg-green-500/20 text-green-300 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    failed: 'bg-red-500/20 text-red-300 border-red-500/30',
    'in progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'in delivery': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    delivered: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="animate-pulse text-2xl font-bold text-medium-text">Loading All Orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-red-400">{t('error')}</h2>
        <p className="text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold">{t('adminDashboard')}</h1>
        <p className="text-lg text-medium-text mt-2">{t('allOrders')}</p>
      </div>
      <div className="bg-light-bg p-4 sm:p-6 rounded-lg shadow-2xl shadow-black/30 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-gray-700">
            <tr>
              <th className="p-4 text-sm font-bold uppercase text-medium-text tracking-wider">{t('orderId')}</th>
              <th className="p-4 text-sm font-bold uppercase text-medium-text tracking-wider">{t('customer')}</th>
              <th className="p-4 text-sm font-bold uppercase text-medium-text tracking-wider">{t('date')}</th>
              <th className="p-4 text-sm font-bold uppercase text-medium-text tracking-wider text-right">{t('total')}</th>
              <th className="p-4 text-sm font-bold uppercase text-medium-text tracking-wider text-center">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-800 hover:bg-dark-bg/50">
                <td className="p-4 font-mono text-sm align-top">{order.id}</td>
                <td className="p-4 text-sm align-top">
                  <p className="font-bold">{order.deliveryDetails.fullName}</p>
                  <p className="text-medium-text">{order.deliveryDetails.email}</p>
                </td>
                <td className="p-4 text-sm align-top">{formatDate(order.date)}</td>
                <td className="p-4 font-bold text-brand-gold text-right align-top">{order.totalPrice.toFixed(2)} {t('currency')}</td>
                <td className="p-4 align-top">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    className={`w-full p-2 rounded-md text-sm font-bold border-2 focus:outline-none focus:ring-2 focus:ring-brand-gold ${statusColors[order.status]}`}
                  >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>
                            {t(status)}
                        </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;