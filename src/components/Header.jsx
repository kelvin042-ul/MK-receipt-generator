/**
 * AURA RECEIPT — Header
 * ------------------------------------------------------------
 * Slim branded top bar. Sticky with backdrop blur so content
 * scrolls beneath it cleanly.
 * ------------------------------------------------------------
 */

import { Receipt } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">

                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-ink flex items-center justify-center">
                        <Receipt size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <div className="leading-tight">
                        <div className="text-[14px] font-bold tracking-tight text-brand-ink">
                            MK Receipt
                        </div>
                        <div className="text-[10px] font-medium text-gray-400 tracking-wide">
                            Receipt &amp; Invoice Generator
                        </div>
                    </div>
                </div>

                {/* Right side — small tagline */}
                <div className="hidden sm:block text-[11px] font-medium text-gray-400 tracking-wide">
                    Free · No signup · Works offline
                </div>

            </div>
        </header>
    );
};

export default Header;