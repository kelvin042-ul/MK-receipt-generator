import { useState, useRef } from 'react';
import {
    FilePlus2, RefreshCw, MoreHorizontal, X,
    Printer, Loader2, Share2, CheckCircle2
} from 'lucide-react';
import { buildReceiptFile, openShareSheet } from '../hooks/useShareReceipt';
import { saveRecent } from '../utils/storage';

const ActionBar = ({ receipt, validation, onAttempt, onSaved }) => {
    const { newDocument, resetAll, docNumber } = receipt;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [preparing, setPreparing] = useState(false);
    const [readyToShare, setReadyToShare] = useState(null); // Stores the generated File
    const [result, setResult] = useState(null);
    const sharingRef = useRef(false);

    const isValid = validation?.isValid ?? true;

    // STEP 1: Build the file
    const handlePrepare = async () => {
        if (!isValid) { onAttempt?.(); return; }
        if (preparing || readyToShare) return;

        sharingRef.current = true;
        setPreparing(true);
        setResult(null);

        const el = document.getElementById('receipt-capture');
        const fileName = `${docNumber || 'receipt'}.png`;

        try {
            const file = await buildReceiptFile(el, fileName);
            setReadyToShare(file); // File is ready! Show the "NOW SEND" modal
        } catch (err) {
            console.error('Preparation failed:', err);
            alert('Could not create the receipt image.');
        }

        setPreparing(false);
        sharingRef.current = false;
    };

    // STEP 2: Native share (Triggered by user clicking "NOW SEND")
    const handleSend = async () => {
        if (!readyToShare) return;

        const outcome = await openShareSheet(readyToShare);

        if (outcome.method === 'share') setResult('shared');
        else if (outcome.method === 'download') setResult('downloaded');

        if (outcome.method === 'share' || outcome.method === 'download') {
            saveRecent({
                docNumber, docType: receipt.docType, customerName: receipt.customer.name,
                total: receipt.total, currency: receipt.currency, date: receipt.date,
                state: { ...receipt }, savedAt: Date.now(),
            });
            onSaved?.();
        }

        setReadyToShare(null); // Reset
        setTimeout(() => setResult(null), 2500);
    };

    const handlePrint = () => {
        setSheetOpen(false);
        setTimeout(() => window.print(), 150);
    };

    const handleNewDocument = () => {
        if (window.confirm('Start a new document? Clears customer and items, keeps your business profile.')) {
            newDocument(); setSheetOpen(false); setReadyToShare(null);
        }
    };

    const handleResetAll = () => {
        if (window.confirm('Reset everything? Erases saved business profile and all inputs.')) {
            resetAll(); setSheetOpen(false); setReadyToShare(null);
        }
    };

    // Determine button state
    let mainBtnLabel = 'Share Receipt';
    let MainIcon = Share2;
    let mainBtnClass = 'bg-brand-navy text-white hover:bg-brand-navy-soft';

    if (preparing) {
        mainBtnLabel = 'Preparing…';
        MainIcon = Loader2;
    } else if (readyToShare) {
        mainBtnLabel = 'NOW SEND';
        MainIcon = CheckCircle2;
        mainBtnClass = 'bg-brand-orange text-white hover:bg-orange-600 animate-pulse';
    } else if (result === 'downloaded') {
        mainBtnLabel = 'Saved to device';
        MainIcon = CheckCircle2;
    } else if (result === 'shared') {
        mainBtnLabel = 'Shared';
        MainIcon = CheckCircle2;
        mainBtnClass = 'bg-green-600 text-white';
    }

    return (
        <>
            {/* DESKTOP */}
            <div className="hidden lg:block bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">Actions</span>
                    {!isValid && <span className="text-[10px] font-medium text-brand-orange">Fill required fields first</span>}
                </div>

                <div className="p-5 space-y-3">
                    <button
                        type="button"
                        onClick={readyToShare ? handleSend : handlePrepare}
                        disabled={(!isValid && !readyToShare) || preparing}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${mainBtnClass}`}
                    >
                        <MainIcon size={16} className={preparing ? 'animate-spin' : ''} />
                        {mainBtnLabel}
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                        <button type="button" onClick={handlePrint} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-50">
                            <Printer size={13} /> Print
                        </button>
                        <button type="button" onClick={handleNewDocument} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-50">
                            <FilePlus2 size={13} /> New
                        </button>
                        <button type="button" onClick={handleResetAll} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-red-500 rounded-lg text-[12px] font-medium hover:bg-red-50 hover:border-red-200">
                            <RefreshCw size={13} /> Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE — fixed bottom bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 print:hidden">
                <div className="px-3 py-3 flex gap-2 max-w-[1400px] mx-auto">
                    <button
                        type="button"
                        onClick={readyToShare ? handleSend : handlePrepare}
                        disabled={(!isValid && !readyToShare) || preparing}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${mainBtnClass}`}
                    >
                        <MainIcon size={16} className={preparing ? 'animate-spin' : ''} />
                        {mainBtnLabel}
                    </button>

                    <button type="button" onClick={() => setSheetOpen(true)} className="px-4 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </div>

            {/* MOBILE SHEET — More Actions */}
            {sheetOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-brand-navy/40 backdrop-blur-sm flex items-end" onClick={() => setSheetOpen(false)}>
                    <div className="w-full bg-white rounded-t-2xl border-t border-gray-200 p-5 space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">More Actions</span>
                            <button type="button" onClick={() => setSheetOpen(false)} className="p-2 text-gray-400 hover:text-brand-ink"><X size={16} /></button>
                        </div>
                        <button type="button" onClick={handleNewDocument} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                            <FilePlus2 size={16} /> <span className="text-[13px] font-medium">New Document</span>
                        </button>
                        <button type="button" onClick={handlePrint} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                            <Printer size={16} /> <span className="text-[13px] font-medium">Print</span>
                        </button>
                        <button type="button" onClick={handleResetAll} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200">
                            <RefreshCw size={16} /> <span className="text-[13px] font-medium">Reset Everything</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActionBar;