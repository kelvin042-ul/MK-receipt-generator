/**
 * AURA RECEIPT — Document Meta
 * ------------------------------------------------------------
 * Top-of-form section:
 *   - Receipt ⟷ Invoice toggle
 *   - Document number (auto-issued, editable)
 *   - Date + optional due date (invoices only)
 *   - Currency selector
 * ------------------------------------------------------------
 */

import { FileText, Receipt as ReceiptIcon, Hash, Calendar, Coins } from 'lucide-react';
import { CURRENCY_LIST } from '../utils/currency';

const DocumentMeta = ({ receipt }) => {
    const {
        docType, switchDocType,
        docNumber, setDocNumber,
        date, setDate,
        dueDate, setDueDate,
        currency, setCurrency,
    } = receipt;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

            {/* Card header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Document
                </span>
            </div>

            <div className="p-5 space-y-5">

                {/* Type toggle — segmented control */}
                <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-1.5 block">
                        Document Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 border border-gray-200 rounded-lg">
                        <button
                            type="button"
                            onClick={() => switchDocType('receipt')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-[13px] font-semibold transition-colors ${docType === 'receipt'
                                    ? 'bg-brand-ink text-white shadow-sm'
                                    : 'text-gray-600 hover:text-brand-ink'
                                }`}
                        >
                            <ReceiptIcon size={14} />
                            Receipt
                        </button>
                        <button
                            type="button"
                            onClick={() => switchDocType('invoice')}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-[13px] font-semibold transition-colors ${docType === 'invoice'
                                    ? 'bg-brand-ink text-white shadow-sm'
                                    : 'text-gray-600 hover:text-brand-ink'
                                }`}
                        >
                            <FileText size={14} />
                            Invoice
                        </button>
                    </div>
                </div>

                {/* Document number + Currency */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                            <Hash size={12} className="text-gray-400" />
                            {docType === 'invoice' ? 'Invoice No.' : 'Receipt No.'}
                        </label>
                        <input
                            type="text"
                            value={docNumber}
                            onChange={(e) => setDocNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-[15px] font-mono font-semibold border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                            placeholder="REC-2025-001"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                            <Coins size={12} className="text-gray-400" />
                            Currency
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors bg-white"
                        >
                            {CURRENCY_LIST.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.symbol} {c.code} — {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Date + Due Date (due only for invoices) */}
                <div className={`grid gap-4 ${docType === 'invoice' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div>
                        <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                            <Calendar size={12} className="text-gray-400" />
                            Date Issued
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors bg-white"
                        />
                    </div>

                    {docType === 'invoice' && (
                        <div>
                            <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                                <Calendar size={12} className="text-gray-400" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors bg-white"
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DocumentMeta;