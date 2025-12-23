import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-dark-bg">
        <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-center overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-center z-0" 
                style={{ backgroundImage: "url('https://storage.googleapis.com/aistudio-hosting/workspace-storage/7a7f45b5-b44c-473d-88e3-53e3d6232742/50cb55a8-20cb-469b-8919-94b2a30bb669.jpeg')" }}
            >
                <div className="absolute inset-0 bg-black/70"></div>
            </div>
            <div className="relative z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-wider uppercase text-light-text">
                {t('contactUs')}
                </h1>
            </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-light-bg p-8 md:p-12 rounded-lg shadow-2xl shadow-black/30">
                <div>
                    <h2 className="text-3xl font-display font-bold mb-4 text-brand-gold">{t('sendMessage')}</h2>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-medium-text mb-2 font-bold">{t('name')}</label>
                            <input type="text" id="name" className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-medium-text mb-2 font-bold">{t('email')}</label>
                            <input type="email" id="email" className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-medium-text mb-2 font-bold">{t('message')}</label>
                            <textarea id="message" rows={5} className="w-full bg-dark-bg border-2 border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-gold text-light-text"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-brand-brown text-dark-bg font-bold p-3 rounded-md hover:bg-opacity-80 transition-colors uppercase">
                            {t('sendMessageButton')}
                        </button>
                    </form>
                </div>
                <div>
                    <h2 className="text-3xl font-display font-bold mb-4 text-brand-gold">{t('contactInfo')}</h2>
                    <p className="text-medium-text mb-8">
                        {t('contactInfoSubtitle')}
                    </p>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <span className="text-brand-brown mt-1"><LocationIcon/></span>
                            <div>
                                <h3 className="font-bold text-light-text">{t('address')}</h3>
                                <p className="text-medium-text">{t('addressValue')}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <span className="text-brand-brown mt-1"><MailIcon/></span>
                            <div>
                                <h3 className="font-bold text-light-text">{t('email')}</h3>
                                <p className="text-medium-text">support@chocobomb.com</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <span className="text-brand-brown mt-1"><PhoneIcon/></span>
                            <div>
                                <h3 className="font-bold text-light-text">{t('phone')}</h3>
                                <p className="text-medium-text">(123) 456-7890</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ContactPage;