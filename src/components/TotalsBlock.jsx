/**
 * AURA RECEIPT — Totals Summary (display only)
 * ------------------------------------------------------------
 * Always-visible live summary: subtotal, discount, tax, total.
 * Discount and tax CONTROLS live in MoreOptions — this card
 * only shows the computed result so the vendor always sees
 * what they're charging.
 * ------------------------------------------------------------
 */

import { Calculator } from 'lucide-react';
import { formatAmount } from '../utils/currency';

const TotalsBlock = ({ receipt }) => {
    const { currency, subtotal, discount, tax, total } = receipt;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Calculator size={16} className="text-gray-400" />
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Summary
                </span>
            </div>

            <div className="p-5 space-y-2.5">

                <div className="flex justify-between text-[13px]">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-mono font-medium text-brand-ink">
                        {formatAmount(subtotal, currency)}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-[13px]">
                        <span className="text-gray-500">Discount</span>
                        <span className="font-mono font-medium text-green-600">
                            −{formatAmount(discount, currency)}
                        </span>
                    </div>
                )}

                {tax > 0 && (
                    <div className="flex justify-between text-[13px]">
                        <span className="text-gray-500">Tax / VAT</span>
                        <span className="font-mono font-medium text-brand-ink">
                            {formatAmount(tax, currency)}
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-baseline pt-3 mt-2 border-t border-gray-100">
                    <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                        Total
                    </span>
                    <span className="text-[20px] font-bold text-brand-ink font-mono tracking-tight break-all">
                        {formatAmount(total, currency)}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default TotalsBlock;