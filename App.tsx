import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { MOCK_PRODUCTS } from './constants';
import { Product } from './types';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BrandsPage from './pages/BrandsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import TrustBar from './components/TrustBar';

const App: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  
  const getPathFromHash = () => window.location.hash.substring(1) || '/';
  const [currentPath, setCurrentPath] = useState(getPathFromHash());

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(getPathFromHash());
    };
    window.addEventListener('hashchange', onLocationChange);
    return () => window.removeEventListener('hashchange', onLocationChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const renderPage = () => {
    if (currentPath === '/') {
      return <HomePage onNavigate={navigate} />;
    }
    if (currentPath === '/products') {
      return <ProductsPage products={filteredProducts} setProducts={setFilteredProducts} onNavigate={navigate} />;
    }
    const productDetailMatch = currentPath.match(/^\/products\/(\d+)$/);
    if (productDetailMatch) {
      const productId = parseInt(productDetailMatch[1], 10);
      return <ProductDetailPage productId={productId} onNavigate={navigate} />;
    }
    if (currentPath === '/brands') {
      return <BrandsPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }
    if (currentPath === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/payment-success')) {
      return <PaymentSuccessPage onNavigate={navigate} currentPath={currentPath} />;
    }
    if (currentPath.startsWith('/payment-failure')) {
      return <PaymentFailurePage onNavigate={navigate} currentPath={currentPath} />;
    }
    if (currentPath === '/profile') {
      return <ProfilePage onNavigate={navigate} />;
    }
    if (currentPath === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }
    if (currentPath === '/signup') {
      return <SignupPage onNavigate={navigate} />;
    }
    if (currentPath === '/admin') {
      return isAdmin ? <AdminPage onNavigate={navigate} /> : <NotFoundPage onNavigate={navigate} />;
    }
    return <NotFoundPage onNavigate={navigate} />;
  }

  return (
    <div className="bg-dark-bg min-h-screen flex flex-col">
      <Header onNavigate={navigate} />
      <TrustBar />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
      <Chatbot />
    </div>
  );
};

export default App;