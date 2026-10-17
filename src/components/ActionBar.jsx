/**
 * AURA RECEIPT — Action Bar
 * ------------------------------------------------------------
 * Tap Share Receipt → build PNG → native share sheet.
 * If the browser can't share files, the PNG downloads instead.
 *
 * No fake Save button. No silent failures.
 * ------------------------------------------------------------
 */

import { useState, useRef } from 'react';
import {
    FilePlus2, RefreshCw, MoreHorizontal, X,
    Printer, Loader2, Share2, Download, Check
} from 'lucide-react';
import { buildReceiptFile, openShareSheet } from '../hooks/useShareReceipt';
import { saveRecent } from '../utils/storage';

const ActionBar = ({ receipt, validation, onAttempt, onSaved }) => {
    const { newDocument, resetAll, docNumber } = receipt;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [preparing, setPreparing] = useState(false);
    const [result, setResult] = useState(null); // 'shared' | 'downloaded' | null
    const sharingRef = useRef(false);

    const isValid = validation?.isValid ?? true;

    const handleShare = async () => {
        if (!isValid) {
            onAttempt?.();
            return;
        }
        if (preparing || sharingRef.current) return;

        sharingRef.current = true;
        setPreparing(true);
        setResult(null);

        const el = document.getElementById('receipt-capture');
        const fileName = `${docNumber || 'receipt'}.png`;

        try {
            const file = await buildReceiptFile(el, fileName);
            const outcome = await openShareSheet(file);

            if (outcome.method === 'share') setResult('shared');
            else if (outcome.method === 'download') setResult('downloaded');

            // Save to recent only after a real share/download
            if (outcome.method === 'share' || outcome.method === 'download') {
                saveRecent({
                    docNumber,
                    docType: receipt.docType,
                    customerName: receipt.customer.name,
                    total: receipt.total,
                    currency: receipt.currency,
                    date: receipt.date,
                    state: {
                        vendor: receipt.vendor,
                        customer: receipt.customer,
                        docType: receipt.docType,
                        docNumber: receipt.docNumber,
                        date: receipt.date,
                        dueDate: receipt.dueDate,
                        currency: receipt.currency,
                        notes: receipt.notes,
                        items: receipt.items,
                        discountValue: receipt.discountValue,
                        discountType: receipt.discountType,
                        taxRate: receipt.taxRate,
                    },
                    savedAt: Date.now(),
                });
                onSaved?.();
            }
        } catch (err) {
            console.error('Share failed:', err);
            alert('Could not create the receipt image. Please try again.');
        }

        // These MUST be outside try/catch, or a throw leaves the spinner stuck
        setPreparing(false);
        sharingRef.current = false;
        setTimeout(() => setResult(null), 2200);
    };

    const handlePrint = () => {
        setSheetOpen(false);
        setTimeout(() => window.print(), 150);
    };

    const handleNewDocument = () => {
        if (window.confirm('Start a new document? Clears customer and items, keeps your business profile.')) {
            newDocument();
            setSheetOpen(false);
        }
    };

    const handleResetAll = () => {
        if (window.confirm('Reset everything? Erases saved business profile and all inputs.')) {
            resetAll();
            setSheetOpen(false);
        }
    };

    const shareLabel = preparing
        ? 'Preparing…'
        : result === 'downloaded'
            ? 'Saved to device'
            : result === 'shared'
                ? 'Shared'
                : 'Share Receipt';

    const ShareIcon = result === 'downloaded' ? Download : result === 'shared' ? Check : Share2;

    return (
        <>
            {/* DESKTOP */}
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
                    <button
                        type="button"
                        onClick={handleShare}
                        disabled={!isValid || preparing}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-navy text-white rounded-lg text-[13px] font-semibold hover:bg-brand-navy-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {preparing ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Preparing…
                            </>
                        ) : (
                            <>
                                <ShareIcon size={16} />
                                {shareLabel}
                            </>
                        )}
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-50 transition-colors"
                        >
                            <Printer size={13} />
                            Print
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
                </div>
            </div>

            {/* MOBILE — fixed bottom bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 print:hidden">
                <div className="px-3 py-3 flex gap-2 max-w-[1400px] mx-auto">
                    <button
                        type="button"
                        onClick={handleShare}
                        disabled={!isValid || preparing}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand-navy text-white rounded-lg text-[13px] font-semibold hover:bg-brand-navy-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {preparing ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Preparing…
                            </>
                        ) : (
                            <>
                                <ShareIcon size={16} />
                                {shareLabel}
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

            {/* MOBILE SHEET — New / Print / Reset */}
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
        </>
    );
};

export default ActionBar;