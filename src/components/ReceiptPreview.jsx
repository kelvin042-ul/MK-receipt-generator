/**
 * AURA RECEIPT — Live Preview (Access Bank inspired)
 * ------------------------------------------------------------
 * Design language:
 *   - Deep navy (#003366) headers + total bar
 *   - Warm orange (#F58220) accent stripes + RECEIPT badge
 *   - Cream surface for print + screen
 *   - JetBrains Mono for numbers
 *
 * The root div has id="receipt-capture" so useShareReceipt can
 * snapshot just this element.
 * ------------------------------------------------------------
 */

import { formatAmount } from '../utils/currency';
import { numberToWords } from '../utils/numberToWords';

const ReceiptPreview = ({ receipt }) => {
    const {
        vendor, customer,
        docType, docNumber, date, dueDate, currency, notes,
        items,
        subtotal, discount, tax, total,
    } = receipt;

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const docLabel = docType === 'invoice' ? 'INVOICE' : 'RECEIPT';
    const totalLabel = docType === 'invoice' ? 'Amount Due' : 'Total Paid';

    return (
        <div
            id="receipt-capture"
            className="w-full max-w-full bg-white rounded-2xl shadow-receipt overflow-hidden print-reset-shadow print-no-break print:border-0 print:rounded-none print:shadow-none"
        >
            {/* ============================================================
          TOP ORANGE STRIPE
          ============================================================ */}
            <div className="h-1.5 bg-brand-orange print:h-1" />

            {/* ============================================================
          NAVY HEADER — business identity + doc type
          ============================================================ */}
            <div className="bg-brand-navy px-5 sm:px-6 md:px-8 py-5 sm:py-6 print:px-6 print:py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    {/* Left: logo + name */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        {vendor.logoUrl && (
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img
                                    src={vendor.logoUrl}
                                    alt=""
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <h1 className="text-[16px] md:text-[19px] font-bold tracking-tight text-white leading-tight break-words">
                                {vendor.businessName || 'Your Business'}
                            </h1>
                            <div className="mt-0.5 text-[11px] md:text-[12px] text-white/70 leading-relaxed break-words">
                                {vendor.phone && <span>{vendor.phone}</span>}
                                {vendor.phone && vendor.email && <span> · </span>}
                                {vendor.email && <span className="break-all">{vendor.email}</span>}
                            </div>
                            {vendor.address && (
                                <div className="mt-0.5 text-[11px] text-white/60 break-words">
                                    {vendor.address}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: doc badge */}
                    <div className="flex-shrink-0">
                        <div className="inline-flex items-center gap-2 bg-brand-orange text-white px-3 py-1.5 rounded-md">
                            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase">
                                {docLabel}
                            </span>
                        </div>
                        <div className="mt-1.5 text-[12px] md:text-[13px] font-mono font-semibold text-white text-right break-all">
                            {docNumber || '—'}
                        </div>
                    </div>

                </div>
            </div>

            {/* ============================================================
          CREAM INFO BAR — billed to + dates
          ============================================================ */}
            <div className="bg-brand-cream-deep px-5 sm:px-6 md:px-8 py-5 print:px-6 print:py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div className="min-w-0">
                        <div className="text-[10px] font-bold tracking-[0.15em] text-brand-navy uppercase mb-1.5">
                            Billed To
                        </div>
                        <div className="text-[14px] md:text-[15px] font-semibold text-brand-ink break-words">
                            {customer.name || 'Customer Name'}
                        </div>
                        <div className="mt-0.5 text-[11px] md:text-[12px] text-brand-muted leading-relaxed break-words">
                            {customer.phone && <div>{customer.phone}</div>}
                            {customer.address && <div>{customer.address}</div>}
                        </div>
                    </div>

                    <div className="sm:text-right">
                        <div className="text-[10px] font-bold tracking-[0.15em] text-brand-navy uppercase mb-1.5">
                            {docType === 'invoice' ? 'Issued / Due' : 'Date Issued'}
                        </div>
                        <div className="text-[13px] md:text-[14px] font-semibold text-brand-ink">
                            {formatDate(date)}
                        </div>
                        {docType === 'invoice' && dueDate && (
                            <div className="text-[13px] md:text-[14px] font-semibold text-brand-orange mt-0.5">
                                Due {formatDate(dueDate)}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ============================================================
          ITEMS
          ============================================================ */}
            <div className="px-5 sm:px-6 md:px-8 pt-6 pb-5 print:px-6">
                {/* Desktop header */}
                <div className="hidden sm:flex sm:items-center gap-3 pb-2 mb-2 border-b-2 border-brand-navy/10">
                    <div className="flex-1 text-[10px] font-bold tracking-[0.15em] text-brand-navy uppercase">
                        Description
                    </div>
                    <div className="w-12 text-[10px] font-bold tracking-[0.15em] text-brand-navy uppercase text-center">
                        Qty
                    </div>
                    <div className="w-24 text-[10px] font-bold tracking-[0.15em] text-brand-navy uppercase text-right">
                        Price
                    </div>
                    <div className="w-28 text-[10px] font-bold tracking-[0.15em] text-brand-navy uppercase text-right">
                        Total
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {items.map((item) => {
                        const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
                        const hasContent = item.description || Number(item.price) > 0;

                        return (
                            <div key={item.id}>
                                {/* Desktop row */}
                                <div className="hidden sm:flex sm:items-center gap-3 py-3">
                                    <div className="flex-1 text-[13px] text-brand-ink pr-2 break-words min-w-0">
                                        {item.description || <span className="text-gray-300 italic">Item description</span>}
                                    </div>
                                    <div className="w-12 text-[13px] text-brand-muted text-center font-mono">
                                        {item.qty || 0}
                                    </div>
                                    <div className="w-24 text-[13px] text-brand-muted text-right font-mono">
                                        {formatAmount(item.price, currency)}
                                    </div>
                                    <div className="w-28 text-[13px] font-semibold text-brand-ink text-right font-mono">
                                        {hasContent ? formatAmount(lineTotal, currency) : '—'}
                                    </div>
                                </div>

                                {/* Mobile row */}
                                <div className="sm:hidden py-3">
                                    <div className="flex justify-between items-start gap-3 mb-1">
                                        <div className="text-[13px] font-medium text-brand-ink break-words flex-1 min-w-0">
                                            {item.description || <span className="text-gray-300 italic">Item description</span>}
                                        </div>
                                        <div className="text-[13px] font-semibold text-brand-ink font-mono flex-shrink-0">
                                            {hasContent ? formatAmount(lineTotal, currency) : '—'}
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-brand-muted font-mono">
                                        {item.qty || 0} × {formatAmount(item.price, currency)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ============================================================
          TOTALS — navy total bar
          ============================================================ */}
            <div className="px-5 sm:px-6 md:px-8 pb-5 print:px-6">
                <div className="flex justify-end">
                    <div className="w-full sm:w-72 space-y-2">

                        <div className="flex justify-between text-[12px] md:text-[13px]">
                            <span className="text-brand-muted">Subtotal</span>
                            <span className="font-mono font-medium text-brand-ink">
                                {formatAmount(subtotal, currency)}
                            </span>
                        </div>

                        {discount > 0 && (
                            <div className="flex justify-between text-[12px] md:text-[13px]">
                                <span className="text-brand-muted">Discount</span>
                                <span className="font-mono font-medium text-brand-orange">
                                    −{formatAmount(discount, currency)}
                                </span>
                            </div>
                        )}

                        {tax > 0 && (
                            <div className="flex justify-between text-[12px] md:text-[13px]">
                                <span className="text-brand-muted">Tax / VAT</span>
                                <span className="font-mono font-medium text-brand-ink">
                                    {formatAmount(tax, currency)}
                                </span>
                            </div>
                        )}

                        {/* Navy total bar */}
                        <div className="flex justify-between items-center bg-brand-navy text-white px-4 py-3 rounded-lg mt-2">
                            <span className="text-[11px] font-bold tracking-[0.15em] uppercase">
                                {totalLabel}
                            </span>
                            <span className="text-[18px] md:text-[20px] font-bold font-mono tracking-tight break-all">
                                {formatAmount(total, currency)}
                            </span>
                        </div>

                    </div>
                </div>

                {total > 0 && (
                    <div className="mt-4 text-right">
                        <div className="text-[10px] font-bold tracking-[0.15em] text-brand-muted uppercase mb-1">
                            Amount in words
                        </div>
                        <div className="text-[11px] md:text-[12px] text-brand-ink italic leading-relaxed break-words">
                            {numberToWords(total, currency)}
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================================
          PAYMENT DETAILS
          ============================================================ */}
            {(vendor.bankName || vendor.accountNumber || vendor.paymentLink) && (
                <div className="px-5 sm:px-6 md:px-8 pb-5 print:px-6">
                    <div className="border-t border-dashed border-gray-200 pt-5">
                        <div className="text-[10px] font-bold tracking-[0.15em] text-brand-navy uppercase mb-3">
                            Payment Details
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {(vendor.bankName || vendor.accountNumber) && (
                                <div className="space-y-1">
                                    {vendor.bankName && (
                                        <div className="flex justify-between gap-3 text-[12px]">
                                            <span className="text-brand-muted">Bank</span>
                                            <span className="font-medium text-brand-ink text-right break-words min-w-0">
                                                {vendor.bankName}
                                            </span>
                                        </div>
                                    )}
                                    {vendor.accountNumber && (
                                        <div className="flex justify-between gap-3 text-[12px]">
                                            <span className="text-brand-muted">Account No.</span>
                                            <span className="font-mono font-semibold text-brand-ink text-right break-all min-w-0">
                                                {vendor.accountNumber}
                                            </span>
                                        </div>
                                    )}
                                    {vendor.accountName && (
                                        <div className="flex justify-between gap-3 text-[12px]">
                                            <span className="text-brand-muted">Account Name</span>
                                            <span className="font-medium text-brand-ink text-right break-words min-w-0">
                                                {vendor.accountName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {vendor.paymentLink && (
                                <div>
                                    <div className="text-[10px] text-brand-muted uppercase tracking-wider mb-1">
                                        Pay Online
                                    </div>
                                    <a
                                        href={vendor.paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-medium text-brand-navy hover:underline break-all"
                                    >
                                        {vendor.paymentLink}
                                    </a>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* Notes */}
            {notes && (
                <div className="px-5 sm:px-6 md:px-8 pb-5 print:px-6">
                    <div className="border-t border-dashed border-gray-200 pt-5">
                        <div className="text-[10px] font-bold tracking-[0.15em] text-brand-navy uppercase mb-2">
                            Notes
                        </div>
                        <div className="text-[11px] md:text-[12px] text-brand-ink leading-relaxed whitespace-pre-wrap break-words">
                            {notes}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================
          FOOTER
          ============================================================ */}
            <div className="px-5 sm:px-6 md:px-8 pb-6 print:px-6">
                <div className="border-t border-dashed border-gray-200 pt-5">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                        <div className="min-w-0">
                            <div className="text-[12px] md:text-[13px] font-semibold text-brand-ink">
                                Thank you for your business!
                            </div>
                            <div className="text-[10px] md:text-[11px] text-brand-muted mt-1">
                                {docType === 'invoice'
                                    ? 'Please settle payment by the due date.'
                                    : 'This is a computer-generated receipt.'}
                            </div>
                        </div>

                        <div className="sm:text-right flex-shrink-0">
                            <div className="border-t border-brand-navy/40 w-32 sm:ml-auto pt-1">
                                <div className="text-[9px] tracking-[0.15em] text-brand-muted uppercase">
                                    Authorized Signature
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ============================================================
          BOTTOM ORANGE STRIPE
          ============================================================ */}
            <div className="h-1.5 bg-brand-orange print:h-1" />

        </div>
    );
};

export default ReceiptPreview;