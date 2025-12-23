import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TrustBar: React.FC = () => {
    const { t } = useLanguage(); 

    const trustPoints = [
        { icon: '🇦🇪', key: 'madeInUAE' },
        { icon: '🚚', key: 'fastDelivery' },
        { icon: '💵', key: 'cashOnDelivery' },
        { icon: '💯', key: 'refundPolicy' },
    ];
    
    return (
        <div className="bg-brand-brown text-dark-bg py-3 px-4">
            <div className="container mx-auto">
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 sm:gap-6 text-sm sm:text-base text-center">
                    {trustPoints.map(point => (
                         <div key={point.key} className="flex items-center gap-2">
                             <span className="text-xl" role="img" aria-label={point.key}>{point.icon}</span>
                             <span className="font-semibold">{t(point.key)}</span>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustBar;