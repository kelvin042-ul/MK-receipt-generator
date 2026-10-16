/**
 * AURA RECEIPT — Action Bar
 * ------------------------------------------------------------
 * Bank-style action flow (Kuda / Opay / PalmPay):
 *
 *   [ Share Receipt ]  → renders receipt → downloads PNG → opens
 *                        native share sheet (mobile)
 *   [ ⋯ Menu ]         → bottom sheet with Save / New / Reset /
 *                        Print (hidden for power users only)
 *
 * NO WhatsApp text. NO print dialog on the main flow.
 * ------------------------------------------------------------
 */

import { useState } from 'react';
import {
    Share2, Check, Save, FilePlus2, RefreshCw,
    MoreHorizontal, X, Printer, Loader2, Download
} from 'lucide-react';
import { shareReceiptAsImage } from '../hooks/useShareReceipt';

const ActionBar = ({ receipt, validation }) => {
    const { newDocument, resetAll, docNumber } = receipt;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [toast, setToast] = useState(null);

    const isValid = validation?.isValid ?? true;

    // ---------- Share (bank-style) ----------
    const handleShare = async () => {
        if (!isValid) return;
        setSharing(true);
        setToast(null);

        const el = document.getElementById('receipt-capture');
        const fileName = `${docNumber || 'receipt'}.png`;

        const result = await shareReceiptAsImage(el, fileName);

        setSharing(false);

        if (!result.ok) {
            setToast({ type: 'error', msg: 'Could not generate receipt. Try again.' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        if (result.shared) {
            setToast({ type: 'success', msg: 'Receipt shared' });
        } else if (result.desktopFallback) {
            setToast({ type: 'info', msg: 'Saved to Downloads. Open WhatsApp to send.' });
        } else if (result.cancelled) {
            // Silent — user closed the share sheet intentionally
        }
        setTimeout(() => setToast(null), 3000);
    };

    // ---------- Print (hidden — inside menu) ----------
    const handlePrint = () => {
        setSheetOpen(false);
        setTimeout(() => window.print(), 150);
    };

    // ---------- Save ----------
    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
    };

    // ---------- New ----------
    const handleNewDocument = () => {
        const ok = window.confirm(
            'Start a new document? This clears the customer and items but keeps your business profile.'
        );
        if (ok) {
            newDocument();
            setSheetOpen(false);
        }
    };

    // ---------- Reset ----------
    const handleResetAll = () => {
        const ok = window.confirm(
            'Reset everything? This erases your saved business profile, bank details, and all inputs.'
        );
        if (ok) {
            resetAll();
            setSheetOpen(false);
        }
    };

    return (
        <>
            {/* ============================================================
          DESKTOP — full action card
          ============================================================ */}
            <div className="hidden lg:block bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                        Actions
                    </span>
                    {!isValid && (
                        <span className="text-[10px] font-medium text-brand-orange">
                            Fill required fields first
                        </span>
                    )}
                </div>

                <div className="p-5 space-y-3">
                    {/* Primary — Share */}
                    <button
                        type="button"
                        onClick={handleShare}
                        disabled={!isValid || sharing}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-navy text-white rounded-lg text-[13px] font-semibold hover:bg-brand-navy-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sharing ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <Share2 size={16} />
                                Share Receipt
                            </>
                        )}
                    </button>

                    {/* Secondary — Save / New / Reset */}
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-medium border transition-colors ${saved
                                    ? 'border-brand-orange bg-brand-orange-soft text-brand-navy'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {saved ? <Check size={13} /> : <Save size={13} />}
                            {saved ? 'Saved' : 'Save'}
                        </button>

                        <button
                            type="button"
                            onClick={handleNewDocument}
                            className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-50 transition-colors"
                        >
                            <FilePlus2 size={13} />
                            New
                        </button>

                        <button
                            type="button"
                            onClick={handleResetAll}
                            className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-red-500 rounded-lg text-[12px] font-medium hover:bg-red-50 hover:border-red-200 transition-colors"
                        >
                            <RefreshCw size={13} />
                            Reset
                        </button>
                    </div>

                    <p className="text-[10px] text-gray-400 text-center pt-1 leading-relaxed">
                        Downloads the receipt and opens your phone's share sheet — pick WhatsApp to send.
                    </p>
                </div>
            </div>

            {/* ============================================================
          MOBILE — fixed bottom bar
          ============================================================ */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 print:hidden">
                <div className="px-3 py-3 flex gap-2 max-w-[1400px] mx-auto">

                    <button
                        type="button"
                        onClick={handleShare}
                        disabled={!isValid || sharing}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand-navy text-white rounded-lg text-[13px] font-semibold hover:bg-brand-navy-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sharing ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <Share2 size={16} />
                                Share Receipt
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSheetOpen(true)}
                        className="px-4 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        aria-label="More actions"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                </div>
            </div>

            {/* ============================================================
          MOBILE SHEET
          ============================================================ */}
            {sheetOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-brand-navy/40 backdrop-blur-sm flex items-end"
                    onClick={() => setSheetOpen(false)}
                >
                    <div
                        className="w-full bg-white rounded-t-2xl border-t border-gray-200 p-5 space-y-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                More Actions
                            </span>
                            <button
                                type="button"
                                onClick={() => setSheetOpen(false)}
                                className="p-2 text-gray-400 hover:text-brand-ink"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border transition-colors ${saved
                                    ? 'border-brand-orange bg-brand-orange-soft text-brand-navy'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {saved ? <Check size={16} /> : <Save size={16} />}
                            <span className="text-[13px] font-medium">
                                {saved ? 'Profile Saved' : 'Save Profile'}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={handleNewDocument}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FilePlus2 size={16} />
                            <span className="text-[13px] font-medium">New Document</span>
                        </button>

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Printer size={16} />
                            <span className="text-[13px] font-medium">Print (advanced)</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleResetAll}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                        >
                            <RefreshCw size={16} />
                            <span className="text-[13px] font-medium">Reset Everything</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ============================================================
          TOAST — feedback after share
          ============================================================ */}
            {toast && (
                <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[90vw]">
                    <div
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-[12px] font-medium text-white ${toast.type === 'success'
                                ? 'bg-brand-navy'
                                : toast.type === 'error'
                                    ? 'bg-red-500'
                                    : 'bg-brand-navy'
                            }`}
                    >
                        {toast.type === 'success' && <Check size={14} />}
                        {toast.type === 'info' && <Download size={14} />}
                        <span>{toast.msg}</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActionBar;