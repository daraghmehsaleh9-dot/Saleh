import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { createOrder } from '../services/orderService';
import { DeliveryDetails } from '../types';
import { useAuth } from '../contexts/AuthContext';

// The URL for the public Cloud Function.
// TODO: Replace with your actual cloud function URL if your region or project ID differs.
const PAYMENT_FUNCTION_URL = "https://us-central1-choco-6155c.cloudfunctions.net/createZiinaPaymentIntent";

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, totalPrice: cartTotalPrice, buyNowItem, setBuyNowItem } = useCart();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (user && user.email) {
      setDeliveryDetails(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  useEffect(() => {
    return () => {
      setBuyNowItem(null);
    };
  }, [setBuyNowItem]);

  const itemsForCheckout = buyNowItem ? [buyNowItem] : cart;
  const totalPrice = buyNowItem 
    ? buyNowItem.price * buyNowItem.quantity 
    : cartTotalPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    const { fullName, address, city, phoneNumber, email } = deliveryDetails;
    if (!fullName || !address || !city || !phoneNumber || !email) {
      setError(t('deliveryFieldsRequired'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setError('');
    setIsProcessing(true);

    try {
      const pendingOrder = await createOrder({
        deliveryDetails,
        items: itemsForCheckout,
        totalPrice,
      }, user?.uid); // Pass UID if user is logged in, otherwise it's a guest order.

      const successUrl = `${window.location.origin}${window.location.pathname}#/payment-success?orderId=${pendingOrder.id}`;
      const failureUrl = `${window.location.origin}${window.location.pathname}#/payment-failure?orderId=${pendingOrder.id}`;

      const [firstName, ...lastNameParts] = fullName.split(' ');
      
      const functionPayload = {
          totalPrice,
          successUrl,
          failureUrl,
          customer: {
              first_name: firstName || 'N/A',
              last_name: lastNameParts.join(' ') || 'N/A',
              email: email,
              phone_number: phoneNumber,
          },
          metadata: {
            orderId: pendingOrder.id
          }
      };

      let idToken = null;
      if (user) {
        idToken = await user.getIdToken();
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      // Call the public HTTPS function using fetch
      const response = await fetch(PAYMENT_FUNCTION_URL, {
        method: 'POST',
        headers: headers,
        // The body must be wrapped in a `data` object to match the callable function format
        body: JSON.stringify({ data: functionPayload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Payment initiation failed.');
      }

      const result = await response.json();
      
      // When calling an onCall function via fetch, the actual return data is nested under a `result` property.
      const redirectUrl = result?.result?.data?.redirectUrl;

      if (redirectUrl) {
        // Use window.top.location.href to break out of any iframes (like the dev environment)
        window.top.location.href = redirectUrl;
      } else {
        console.error('Could not extract redirectUrl from response:', result);
        throw new Error('No redirect URL received from the server.');
      }

    } catch (err: any) {
      console.error("Payment process failed:", err);
      setError(err.message || 'Could not initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (itemsForCheckout.length === 0) {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[70vh]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-center mb-12">{t('checkout')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* --- Delivery Details --- */}
          <div className="bg-light-bg p-8 rounded-lg shadow-2xl shadow-black/30">
            <h2 className="text-2xl font-bold mb-6">{t('deliveryDetails')}</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-medium-text mb-1">{t('fullName')}</label>
                <input type="text" name="fullName" id="fullName" value={deliveryDetails.fullName} onChange={handleInputChange} className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-medium-text mb-1">{t('email')}</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={deliveryDetails.email} 
                    onChange={handleInputChange} 
                    className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text disabled:bg-gray-800/50 disabled:cursor-not-allowed"
                    disabled={!!(user && !user.isAnonymous)} // Disable only for logged-in (non-anonymous) users
                    required 
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-bold text-medium-text mb-1">{t('address')}</label>
                <input type="text" name="address" id="address" value={deliveryDetails.address} onChange={handleInputChange} className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-bold text-medium-text mb-1">{t('city')}</label>
                <input type="text" name="city" id="city" value={deliveryDetails.city} onChange={handleInputChange} className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text" />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-bold text-medium-text mb-1">{t('phoneNumber')}</label>
                <input type="tel" name="phoneNumber" id="phoneNumber" value={deliveryDetails.phoneNumber} onChange={handleInputChange} className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text" />
              </div>
            </form>
          </div>

          {/* --- Order Summary --- */}
          <div className="bg-light-bg p-8 rounded-lg shadow-2xl shadow-black/30 h-fit">
            <h2 className="text-2xl font-bold mb-6">{t('orderSummary')}</h2>
            <div className="mb-6 border-b border-gray-700 pb-6 min-h-[100px]">
                <div className="space-y-2 text-medium-text">
                    {itemsForCheckout.map(item => (
                        <div key={item.id} className="flex justify-between">
                            <span>{item.name[language]} x {item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(2)} {t('currency')}</span>
                        </div>
                    ))}
                    {itemsForCheckout.length === 0 && <p className="text-center py-4">{t('cartIsEmpty')}</p>}
                </div>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold mb-6">
                <span>{t('total')}</span>
                <span className="text-brand-gold">{totalPrice.toFixed(2)} {t('currency')}</span>
            </div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <button
                onClick={handlePayment}
                disabled={itemsForCheckout.length === 0 || isProcessing}
                className="w-full bg-brand-brown text-dark-bg font-bold p-4 rounded-md hover:bg-opacity-80 transition-colors uppercase text-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isProcessing ? t('processing') : t('payWithZiina')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;