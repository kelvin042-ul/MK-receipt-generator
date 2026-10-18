/**
 * AURA RECEIPT — Welcome Modal
 * ------------------------------------------------------------
 * Shown ONCE per browser, ever.
 * After dismissal, sets `aura.visited = "true"` in LocalStorage.
 *
 * Design:
 *   - No animations (per project rule)
 *   - Dismissible via X, "Get started" button, or clicking backdrop
 *   - Reads/writes LocalStorage synchronously — no flicker
 * ------------------------------------------------------------
 */

import { useState } from 'react';
import { Receipt, X, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'aura.visited';

const WelcomeModal = ({ onClose }) => {
    const [dismissing, setDismissing] = useState(false);

    const dismiss = () => {
        if (dismissing) return;
        setDismissing(true);
        try {
            localStorage.setItem(STORAGE_KEY, 'true');
        } catch {
            // no-op — private mode etc.
        }
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm"
            onClick={dismiss}
        >
            <div
                className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={dismiss}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-brand-ink transition-colors rounded-lg hover:bg-gray-50"
                    aria-label="Close"
                >
                    <X size={16} />
                </button>

                {/* Content */}
                <div className="px-6 pt-8 pb-6 text-center">

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-brand-ink flex items-center justify-center mx-auto mb-4">
                        <Receipt size={24} className="text-white" strokeWidth={2} />
                    </div>

                    {/* Title */}
                    <h2 className="text-[20px] font-bold tracking-tight text-brand-ink">
                        Welcome to MK Receipt
                    </h2>

                    {/* Body */}
                    <p className="mt-2.5 text-[13px] text-gray-500 leading-relaxed">
                        Create a professional receipt or invoice in under 30 seconds.
                        Your business details save automatically — you type them
                        once, never again.
                    </p>

                    {/* Feature bullets */}
                    <div className="mt-5 space-y-2 text-left">
                        <div className="flex items-center gap-2.5 text-[12px] text-gray-600">
                            <Zap size={14} className="text-brand-purple flex-shrink-0" />
                            <span>Loads instantly</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[12px] text-gray-600">
                            <ShieldCheck size={14} className="text-brand-purple flex-shrink-0" />
                            <span>No signup, fully private</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[12px] text-gray-600">
                            <Sparkles size={14} className="text-brand-purple flex-shrink-0" />
                            <span>Share on WhatsApp in one tap</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        type="button"
                        onClick={dismiss}
                        className="mt-6 w-full py-3.5 bg-brand-ink text-white rounded-lg text-[13px] font-semibold hover:bg-black transition-colors"
                    >
                        Get started
                    </button>

                    {/* Footer */}
                    <p className="mt-3 text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                        Free · No signup
                    </p>

                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;