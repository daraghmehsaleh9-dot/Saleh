import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      onNavigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-light-bg p-8 rounded-lg shadow-2xl shadow-black/30">
        <h1 className="text-4xl font-display font-bold text-center mb-8">{t('login')}</h1>
        {error && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-medium-text mb-2 font-bold">{t('email')}</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text" 
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-medium-text mb-2 font-bold">{t('password')}</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-brown text-dark-bg font-bold p-3 rounded-md hover:bg-opacity-80 transition-colors uppercase disabled:bg-gray-600"
          >
            {isLoading ? t('processing') : t('login')}
          </button>
        </form>
        <p className="text-center mt-6 text-medium-text">
          {t('dontHaveAccount')}{' '}
          <a href="#/signup" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }} className="text-brand-gold hover:underline font-bold">
            {t('signup')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;