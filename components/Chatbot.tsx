import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dark-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
    </svg>
);

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { language, t } = useLanguage();

    useEffect(() => {
        if (isOpen) {
             setMessages([
                { id: 'initial', role: 'model', text: t('chatbotGreeting') }
            ]);
        }
    }, [isOpen, t, language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        const modelResponse: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: '' };
        setMessages(prev => [...prev, modelResponse]);

        try {
            const stream = getChatbotResponse(input, language);
            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelResponse.id ? { ...msg, text: fullText } : msg
                ));
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorResponse: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: t('chatbotError') };
             setMessages(prev => prev.filter(msg => msg.id !== modelResponse.id).concat(errorResponse));
        } finally {
            setIsLoading(false);
        }
    };
    
    const positionClass = language === 'ar' ? 'left-6' : 'right-6';

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 ${positionClass} bg-brand-brown rounded-full p-4 shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-brown transition-transform transform hover:scale-110`}
                aria-label={t('openChat')}
            >
                <ChatIcon />
            </button>

            {isOpen && (
                <div className={`fixed bottom-24 ${positionClass} w-full max-w-sm h-[70vh] max-h-[600px] bg-light-bg rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden`}>
                    <header className="bg-dark-bg p-4 flex justify-between items-center text-light-text border-b border-gray-700">
                        <h3 className="font-bold text-lg">{t('chatbotHeader')}</h3>
                        <button onClick={() => setIsOpen(false)} className="hover:text-brand-gold"><CloseIcon /></button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-brand-brown text-dark-bg' : 'bg-gray-700 text-light-text'}`}>
                                    {msg.text}
                                    {isLoading && msg.role === 'model' && msg.text === '' && <span className="animate-pulse">...</span>}
                                </div>
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-700 bg-dark-bg">
                        <div className="flex items-center bg-light-bg rounded-full">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={t('chatbotPlaceholder')}
                                className="w-full bg-transparent px-4 py-2 text-light-text focus:outline-none"
                                disabled={isLoading}
                            />
                            <button onClick={handleSendMessage} disabled={isLoading} className="p-2 text-brand-brown disabled:text-gray-500">
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;