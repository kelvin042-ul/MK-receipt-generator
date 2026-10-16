/**
 * AURA RECEIPT — Document Type Toggle
 * ------------------------------------------------------------
 * Simple segmented control: Receipt | Invoice
 * Switching issues a new doc number and unlocks due-date field.
 * ------------------------------------------------------------
 */

import { Receipt as ReceiptIcon, FileText } from 'lucide-react';

const DocTypeToggle = ({ receipt }) => {
    const { docType, switchDocType } = receipt;

    const base =
        'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-[13px] font-semibold transition-colors';

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-1.5">
            <div className="grid grid-cols-2 gap-1.5">
                <button
                    type="button"
                    onClick={() => switchDocType('receipt')}
                    className={`${base} ${docType === 'receipt'
                            ? 'bg-brand-navy text-white shadow-sm'
                            : 'text-brand-muted hover:text-brand-navy'
                        }`}
                >
                    <ReceiptIcon size={14} />
                    Receipt
                </button>
                <button
                    type="button"
                    onClick={() => switchDocType('invoice')}
                    className={`${base} ${docType === 'invoice'
                            ? 'bg-brand-navy text-white shadow-sm'
                            : 'text-brand-muted hover:text-brand-navy'
                        }`}
                >
                    <FileText size={14} />
                    Invoice
                </button>
            </div>
        </div>
    );
};

export default DocTypeToggle;