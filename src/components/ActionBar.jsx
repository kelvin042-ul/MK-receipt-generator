import { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client'; // We need this to render the hidden canvas
import { FilePlus2, RefreshCw, MoreHorizontal, X, Printer, Loader2, Share2, CheckCircle2 } from 'lucide-react';
import { buildReceiptFile, openShareSheet } from '../hooks/useShareReceipt';
import { saveRecent } from '../utils/storage';
import ReceiptCanvas from './ReceiptCanvas'; // IMPORT THE NEW CANVAS

const ActionBar = ({ receipt, validation, onAttempt, onSaved }) => {
    const { newDocument, resetAll, docNumber } = receipt;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [preparing, setPreparing] = useState(false);
    const [readyToShare, setReadyToShare] = useState(null);
    const [result, setResult] = useState(null);
    const sharingRef = useRef(false);

    const isValid = validation?.isValid ?? true;

    const handlePrepare = async () => {
        if (!isValid) {
            onAttempt?.();
            return;
        }
        if (preparing || readyToShare) return;

        sharingRef.current = true;
        setPreparing(true);
        setResult(null);

        let hiddenContainer = null;
        let root = null;

        try {
            // 1. Create off-screen container
            hiddenContainer = document.createElement('div');
            hiddenContainer.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      pointer-events: none;
      z-index: -1;
    `;
            document.body.appendChild(hiddenContainer);

            // 2. First render at scale = 1 so we can measure natural height
            root = createRoot(hiddenContainer);
            root.render(<ReceiptCanvas receipt={receipt} scale={1} />);

            // Wait for React + fonts
            await new Promise((r) => setTimeout(r, 500));
            if (document.fonts?.ready) await document.fonts.ready;

            // Wait for logo if it exists
            const logo = hiddenContainer.querySelector('img');
            if (logo && !logo.complete) {
                await new Promise((resolve) => {
                    logo.onload = resolve;
                    logo.onerror = resolve;
                    setTimeout(resolve, 1200);
                });
            }

            // 3. Measure the natural height of the content
            const canvasEl = hiddenContainer.querySelector('#receipt-capture-canvas');
            const innerContent = canvasEl?.firstElementChild;
            const naturalHeight = innerContent ? innerContent.scrollHeight : 1350;

            // 4. Calculate the best scale so content fills the 4:5 box nicely
            const availableHeight = 1350 - 40; // small safety margin
            let scale = availableHeight / naturalHeight;

            // Clamp so text never becomes too big or too small
            scale = Math.min(1.22, Math.max(0.70, scale));

            // 5. Re-render with the calculated scale
            root.render(<ReceiptCanvas receipt={receipt} scale={scale} />);
            await new Promise((r) => setTimeout(r, 250));

            // 6. Capture the final image
            const el = hiddenContainer.querySelector('#receipt-capture-canvas');
            if (!el) throw new Error('Canvas element not found');

            const fileName = `${docNumber || 'receipt'}.png`;
            const file = await buildReceiptFile(el, fileName);

            setReadyToShare(file);
        } catch (err) {
            console.error('Preparation failed:', err);
            alert('Could not create the receipt image. Please try again.');
        } finally {
            if (root) root.unmount();
            if (hiddenContainer && hiddenContainer.parentNode) {
                document.body.removeChild(hiddenContainer);
            }
            setPreparing(false);
            sharingRef.current = false;
        }
    };

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

        setReadyToShare(null);
        setTimeout(() => setResult(null), 2500);
    };

    // ... rest of the component stays exactly the same (buttons, mobile sheet, etc.)
    const handlePrint = () => { setSheetOpen(false); setTimeout(() => window.print(), 150); };
    const handleNewDocument = () => { if (window.confirm('Start a new document?')) { newDocument(); setSheetOpen(false); setReadyToShare(null); } };
    const handleResetAll = () => { if (window.confirm('Reset everything?')) { resetAll(); setSheetOpen(false); setReadyToShare(null); } };

    let mainBtnLabel = 'Share Receipt';
    let MainIcon = Share2;
    let mainBtnClass = 'bg-brand-navy text-white hover:bg-brand-navy-soft';

    if (preparing) { mainBtnLabel = 'Preparing…'; MainIcon = Loader2; }
    else if (readyToShare) { mainBtnLabel = 'NOW SEND'; MainIcon = CheckCircle2; mainBtnClass = 'bg-brand-orange text-white hover:bg-orange-600 animate-pulse'; }
    else if (result === 'downloaded') { mainBtnLabel = 'Saved to device'; MainIcon = CheckCircle2; }
    else if (result === 'shared') { mainBtnLabel = 'Shared'; MainIcon = CheckCircle2; mainBtnClass = 'bg-green-600 text-white'; }

    return (
        // ... Exactly the same JSX as before ...
        <>
            <div className="hidden lg:block bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">Actions</span>
                    {!isValid && <span className="text-[10px] font-medium text-brand-orange">Fill required fields first</span>}
                </div>
                <div className="p-5 space-y-3">
                    <button type="button" onClick={readyToShare ? handleSend : handlePrepare} disabled={(!isValid && !readyToShare) || preparing} className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${mainBtnClass}`}>
                        <MainIcon size={16} className={preparing ? 'animate-spin' : ''} /> {mainBtnLabel}
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                        <button type="button" onClick={handlePrint} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-50"><Printer size={13} /> Print</button>
                        <button type="button" onClick={handleNewDocument} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-50"><FilePlus2 size={13} /> New</button>
                        <button type="button" onClick={handleResetAll} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-red-500 rounded-lg text-[12px] font-medium hover:bg-red-50 hover:border-red-200"><RefreshCw size={13} /> Reset</button>
                    </div>
                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 print:hidden">
                <div className="px-3 py-3 flex gap-2 max-w-[1400px] mx-auto">
                    <button type="button" onClick={readyToShare ? handleSend : handlePrepare} disabled={(!isValid && !readyToShare) || preparing} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${mainBtnClass}`}>
                        <MainIcon size={16} className={preparing ? 'animate-spin' : ''} /> {mainBtnLabel}
                    </button>
                    <button type="button" onClick={() => setSheetOpen(true)} className="px-4 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"><MoreHorizontal size={18} /></button>
                </div>
            </div>

            {sheetOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-brand-navy/40 backdrop-blur-sm flex items-end" onClick={() => setSheetOpen(false)}>
                    <div className="w-full bg-white rounded-t-2xl border-t border-gray-200 p-5 space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">More Actions</span>
                            <button type="button" onClick={() => setSheetOpen(false)} className="p-2 text-gray-400 hover:text-brand-ink"><X size={16} /></button>
                        </div>
                        <button type="button" onClick={handleNewDocument} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"><FilePlus2 size={16} /> <span className="text-[13px] font-medium">New Document</span></button>
                        <button type="button" onClick={handlePrint} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"><Printer size={16} /> <span className="text-[13px] font-medium">Print</span></button>
                        <button type="button" onClick={handleResetAll} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200"><RefreshCw size={16} /> <span className="text-[13px] font-medium">Reset Everything</span></button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActionBar;