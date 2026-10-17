/**
 * AURA RECEIPT — Recent Receipts
 * ------------------------------------------------------------
 * Last 5 shared docs. Tap to restore into the form, then
 * hit Share again to resend. This is the paper-beating feature.
 * ------------------------------------------------------------
 */

import { History, RotateCcw } from 'lucide-react';
import { formatAmount } from '../utils/currency';

const RecentReceipts = ({ recent, onRestore }) => {
    if (!recent?.length) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <History size={16} className="text-gray-400" />
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Recent
                </span>
            </div>

            <div className="divide-y divide-gray-100">
                {recent.map((r) => (
                    <button
                        key={r.docNumber + r.savedAt}
                        type="button"
                        onClick={() => onRestore(r.state)}
                        className="w-full px-5 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-semibold text-brand-ink truncate">
                                {r.customerName || 'No customer'}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono truncate">
                                {r.docNumber} · {r.date}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[12px] font-mono font-semibold text-brand-ink">
                                {formatAmount(r.total, r.currency)}
                            </span>
                            <RotateCcw size={13} className="text-gray-300" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RecentReceipts;