import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round"></line>
    </svg>
);

const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
        <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2.02c-.217-.035-.438-.06-.662-.074-.97-.145-1.933-.51-2.651-1.043-.732-.54-1.28-1.284-1.688-2.034a3.99 3.99 0 0 0-.083-3.886zm3.321 6.046c.144-.434.254-.92.321-1.434a5.16 5.16 0 0 1 .083-1.543l-2.42.493a3.52 3.52 0 0 0-1.87 1.838c-.33.62-.638 1.285-.85 1.956-.213.67-.328 1.393-.328 2.158 0 .86.215 1.705.588 2.453.372.748.88 1.398 1.492 1.942.61.543 1.314.972 2.068 1.272a4.19 4.19 0 0 0 2.37.52l.008-.002v-2.02c-.395.08-.802.12-1.22.12-.483 0-.95-.1-1.385-.29a3.74 3.74 0 0 1-1.59-1.096c-.44-.45-.774-.98-.99-1.554a4.17 4.17 0 0 1-.22-1.97z"/>
    </svg>
);


const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  }

  return (
    <footer className="bg-light-bg border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display text-brand-brown font-bold mb-4">{t('shop')}</h3>
            <ul className="space-y-2 text-medium-text">
              <li><a href="#/products" onClick={(e) => handleNavClick(e, '/products')} className="hover:text-light-text">{t('darkChocolate')}</a></li>
              <li><a href="#/products" onClick={(e) => handleNavClick(e, '/products')} className="hover:text-light-text">{t('milkChocolate')}</a></li>
              <li><a href="#/products" onClick={(e) => handleNavClick(e, '/products')} className="hover:text-light-text">{t('whiteChocolate')}</a></li>
              <li><a href="#/products" onClick={(e) => handleNavClick(e, '/products')} className="hover:text-light-text">{t('specialOffers')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-display text-brand-brown font-bold mb-4">{t('aboutUs')}</h3>
            <p className="text-medium-text leading-relaxed">{t('aboutUsContent')}</p>
          </div>
          <div>
            <h3 className="text-xl font-display text-brand-brown font-bold mb-4">{t('shippingAndReturns')}</h3>
            <p className="text-medium-text leading-relaxed">{t('shippingAndReturnsContent')}</p>
          </div>
          <div>
            <h3 className="text-xl font-display text-brand-brown font-bold mb-4">{t('contactUs')}</h3>
             <div className="space-y-4 text-medium-text">
                <div>
                    <p className="font-bold text-light-text">{t('address')}</p>
                    <p>{t('addressValue')}</p>
                </div>
                 <div>
                    <p className="font-bold text-light-text">{t('email')}</p>
                    <p className="hover:text-brand-gold break-all"><a href={`mailto:${t('emailValue')}`}>{t('emailValue')}</a></p>
                </div>
            </div>
             <div className={`flex space-x-4 mt-6 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
               <a href="#" aria-label="Instagram" className="text-medium-text hover:text-brand-gold transition-colors"><InstagramIcon /></a>
               <a href="#" aria-label="TikTok" className="text-medium-text hover:text-brand-gold transition-colors"><TikTokIcon /></a>
             </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-medium-text">
          <p>&copy; {new Date().getFullYear()} {t('choco')}-{t('bomb')}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;