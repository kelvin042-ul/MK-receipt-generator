import { useState, useEffect } from 'react';
import { Lock, CheckCircle2, Bookmark } from 'lucide-react';

const MASTER_KEY = 'MK-5K-VIP';

export default function Paywall({ onUnlock }) {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const [justUnlocked, setJustUnlocked] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlKey = urlParams.get('key');

        if (urlKey && urlKey.trim().toUpperCase() === MASTER_KEY) {
            // 1. Save license
            localStorage.setItem('mk_license', MASTER_KEY);

            // 2. Instantly hide the ?key= from the URL bar
            window.history.replaceState({}, document.title, window.location.pathname);

            // 3. Show the welcome message
            setJustUnlocked(true);
        }
    }, []);

    const handleUnlock = (e) => {
        e.preventDefault();
        const cleanKey = key.trim().toUpperCase();

        if (cleanKey === MASTER_KEY) {
            localStorage.setItem('mk_license', cleanKey);

            // This reloads the page to fix the blank screen bug when typing the key manually
            window.location.reload();
        } else {
            setError('Invalid key. Please check your Selar receipt.');
        }
    };

    // If they just paid and got redirected, show this message
    if (justUnlocked) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-sm">
                <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Your app is now unlocked on this device.
                    </p>

                    <div className="bg-brand-cream p-4 rounded-xl mb-6 border border-gray-200">
                        <div className="flex items-center justify-center gap-2 text-brand-navy font-semibold mb-1">
                            <Bookmark size={18} />
                            Important: Save this link
                        </div>
                        <p className="text-xs text-gray-600">
                            Bookmark this page or add it to your home screen. Always use <strong>mk-receipt.vercel.app</strong> to create receipts.
                        </p>
                    </div>

                    <button
                        onClick={onUnlock}
                        className="w-full py-3.5 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                    >
                        Start Creating Receipts
                    </button>
                </div>
            </div>
        );
    }

    // The normal Lock screen
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
                <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-brand-navy mb-2">Unlock MK Receipt</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Enter your license key from your Selar purchase email to activate this device.
                </p>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <input
                        type="text"
                        placeholder="MK-5K-XXXX"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest border-2 border-gray-200 rounded-xl focus:border-brand-orange outline-none uppercase"
                    />
                    {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                    >
                        Activate App
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3">Don't have a key yet?</p>
                    <a
                        href="https://selar.com/mk-receipt" // <--- ENSURE THIS IS YOUR ACTUAL SELAR LINK
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full py-3.5 bg-gray-100 text-brand-navy font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Buy License Key (₦5,000)
                    </a>
                </div>
            </div>
        </div>
    );
}