import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-gold" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M15.5 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
    </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const AccountIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


interface HeaderProps {
    onNavigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const { t, language } = useLanguage();
    const { totalItems } = useCart();
    const { user, logout, isAdmin } = useAuth();
    const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setAccountMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [accountMenuRef]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        onNavigate(path);
    }
    
    const handleLogout = async () => {
        setAccountMenuOpen(false);
        await logout();
        onNavigate('/');
    };

    const navClasses = language === 'ar' ? 'space-x-reverse space-x-6' : 'space-x-6';
    const marginClass = language === 'ar' ? 'mr-2' : 'ml-2';

    return (
        <header className="bg-light-bg/80 backdrop-blur-sm sticky top-0 z-50 shadow-md shadow-black/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
                        <LogoIcon />
                        <h1 className={`${marginClass} text-4xl font-display font-bold tracking-wider`}>
                            <span className="text-brand-gold">{t('choco')}</span>-{t('bomb')}
                        </h1>
                    </div>
                    
                    <div className="flex items-center">
                        <nav className={`hidden lg:flex ${navClasses} text-medium-text font-bold`}>
                            <a href="#/" onClick={(e) => handleNavClick(e, '/')} className="hover:text-brand-gold transition-colors">{t('home')}</a>
                            <a href="#/products" onClick={(e) => handleNavClick(e, '/products')} className="hover:text-brand-gold transition-colors">{t('products')}</a>
                            <a href="#/contact" onClick={(e) => handleNavClick(e, '/contact')} className="hover:text-brand-gold transition-colors">{t('contactUs')}</a>
                        </nav>
                        <div className="mx-4">
                           <LanguageSwitcher />
                        </div>
                         <div className="relative">
                            <button 
                                onClick={() => onNavigate('/cart')} 
                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                                aria-label="View shopping cart"
                            >
                                <CartIcon />
                            </button>
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-gold text-dark-bg text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center pointer-events-none">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        <div className="ml-4 border-l border-gray-700 pl-4 flex items-center">
                            <div className="relative" ref={accountMenuRef}>
                                <button 
                                    onClick={() => setAccountMenuOpen(!isAccountMenuOpen)}
                                    className="p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center"
                                    aria-label="Account menu"
                                >
                                    <AccountIcon />
                                    {user && !user.isAnonymous && (
                                        <span className="text-sm text-medium-text hidden sm:inline truncate max-w-[150px] ml-2">{user.email}</span>
                                    )}
                                </button>
                                {isAccountMenuOpen && (
                                    <div className={`absolute mt-2 w-48 bg-light-bg rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 ${language === 'ar' ? 'left-0' : 'right-0'}`}>
                                        {user && !user.isAnonymous ? (
                                            <>
                                                <a 
                                                    href="#/profile" 
                                                    onClick={(e) => { handleNavClick(e, '/profile'); setAccountMenuOpen(false); }} 
                                                    className="block w-full text-left px-4 py-2 text-sm text-light-text hover:bg-dark-bg"
                                                >{t('myProfile')}</a>
                                                {isAdmin && (
                                                    <a 
                                                        href="#/admin" 
                                                        onClick={(e) => { handleNavClick(e, '/admin'); setAccountMenuOpen(false); }} 
                                                        className="block w-full text-left px-4 py-2 text-sm text-light-text hover:bg-dark-bg"
                                                    >{t('admin')}</a>
                                                )}
                                                <a 
                                                    href="#" 
                                                    onClick={handleLogout} 
                                                    className="block w-full text-left px-4 py-2 text-sm text-light-text hover:bg-dark-bg"
                                                >{t('logout')}</a>
                                            </>
                                        ) : (
                                            <>
                                                <a 
                                                    href="#/login" 
                                                    onClick={(e) => { handleNavClick(e, '/login'); setAccountMenuOpen(false); }} 
                                                    className="block w-full text-left px-4 py-2 text-sm text-light-text hover:bg-dark-bg"
                                                >{t('login')}</a>
                                                <a 
                                                    href="#/signup" 
                                                    onClick={(e) => { handleNavClick(e, '/signup'); setAccountMenuOpen(false); }} 
                                                    className="block w-full text-left px-4 py-2 text-sm text-light-text hover:bg-dark-bg"
                                                >{t('signup')}</a>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;