"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COOKIE_CONSENT_KEY = 'cookie_consent';
const REDIRECT_URL_KEY = 'redirect_url';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        const redirectUrl = localStorage.getItem(REDIRECT_URL_KEY);

        if (!consent) {
            setIsVisible(true);
            if (redirectUrl) {
                localStorage.removeItem(REDIRECT_URL_KEY); // Clear the redirect URL after use
            }
        } else if (redirectUrl) {
            router.push(redirectUrl); // Redirect to the previous page if consent was previously given
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        setIsVisible(false);
        const redirectUrl = localStorage.getItem(REDIRECT_URL_KEY);
        if (redirectUrl) {
            router.push(redirectUrl); // Redirect if there was a previously stored URL
        }
    };

    const handleDecline = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'false');
        setIsVisible(false);
        router.push('/'); // Redirect to homepage or a specific page
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#f1f1f1] text-black p-4 flex justify-between items-center z-50 shadow-lg">
            <span className="text-sm">
                Utilizziamo i cookie per migliorare la tua esperienza. Continuando a visitare questo sito, accetti il nostro utilizzo dei cookie.
            </span>
            <div className="flex space-x-4">
                <button
                    onClick={handleAccept}
                    className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Accetta
                </button>
                <button
                    onClick={handleDecline}
                    className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 transition-colors"
                >
                    Rifiuta
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
