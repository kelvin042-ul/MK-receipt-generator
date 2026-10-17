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
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).replace(/\//g, '-');
    };

    const docLabel = docType === 'invoice' ? 'INVOICE' : 'TRANSACTION RECEIPT';

    // Strict, non-stretching row layout
    const Row = ({ label, value, isLast }) => (
        <div className={`flex flex-col sm:flex-row sm:items-start py-3.5 ${!isLast ? 'border-b border-gray-200' : ''}`}>
            <div className="w-full sm:w-48 flex-shrink-0 text-[13px] font-bold text-brand-orange mb-1 sm:mb-0">
                {label}
            </div>
            <div className="flex-1 text-[14px] text-brand-navy break-words font-medium">
                {value}
            </div>
        </div>
    );

    return (
        <div
            className="w-full bg-white print:border-0 print:shadow-none print:rounded-none"
        >
            {/* Strict max-width and constant padding. No justify-between. */}
            <div className="p-8 max-w-[800px] mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-2">
                        {vendor.logoUrl ? (
                            <img src={vendor.logoUrl} alt="Logo" className="h-10 max-w-[120px] object-contain" />
                        ) : (
                            <div className="text-xl font-bold text-brand-navy uppercase tracking-wide">
                                {vendor.businessName || 'Your Business'}
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-brand-orange tracking-wider">
                            {vendor.phone ? 'Contact Us' : 'Thank You'}
                        </div>
                    </div>
                </div>

                {/* TITLE */}
                <div className="text-center mb-8">
                    <h1 className="text-[22px] font-bold text-brand-navy uppercase tracking-tight mb-1">
                        {docLabel}
                    </h1>
                    <p className="text-[11px] text-gray-500">
                        Generated on {formatDate(date)} · {docNumber || '—'}
                    </p>
                </div>

                {/* DETAILS ROWS - Stacks strictly without stretching */}
                <div className="border-t border-gray-200">
                    <Row label="Transaction Amount" value={<span className="text-[18px] font-bold">{formatAmount(total, currency)}</span>} />

                    <Row label="Billed To" value={
                        <>
                            <div className="font-bold text-[15px]">{customer.name || 'Customer Name'}</div>
                            {customer.phone && <div className="text-[12px] text-gray-600 mt-0.5">{customer.phone}</div>}
                            {customer.address && <div className="text-[12px] text-gray-600 mt-0.5">{customer.address}</div>}
                        </>
                    } />

                    {items.map((item, index) => {
                        const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
                        if (!item.description && lineTotal === 0) return null;
                        return (
                            <Row
                                key={item.id}
                                label={index === 0 ? "Description" : ""}
                                value={
                                    <div className="flex justify-between w-full gap-4">
                                        <span>{item.description || 'Item'} <span className="text-gray-400 text-xs ml-1 whitespace-nowrap">({item.qty} × {formatAmount(item.price, currency)})</span></span>
                                        <span className="font-mono font-semibold whitespace-nowrap">{formatAmount(lineTotal, currency)}</span>
                                    </div>
                                }
                            />
                        );
                    })}

                    {subtotal !== total && <Row label="Subtotal" value={formatAmount(subtotal, currency)} />}
                    {discount > 0 && <Row label="Discount" value={<span className="text-brand-orange">-{formatAmount(discount, currency)}</span>} />}
                    {tax > 0 && <Row label="Tax / VAT" value={formatAmount(tax, currency)} />}

                    <Row label="Amount in Words" value={<span className="text-[13px] italic">{numberToWords(total, currency)}</span>} />

                    {/* PAYMENT DETAILS */}
                    {(vendor.bankName || vendor.accountNumber) && (
                        <Row label="Payment Details" value={
                            <>
                                {vendor.bankName && <div>{vendor.bankName}</div>}
                                {vendor.accountNumber && <div className="font-mono">{vendor.accountNumber}</div>}
                                {vendor.accountName && <div>{vendor.accountName}</div>}
                            </>
                        } />
                    )}

                    {vendor.paymentLink && (
                        <Row label="Pay Online" value={<span className="text-brand-navy underline text-[12px] break-all">{vendor.paymentLink}</span>} />
                    )}

                    {docType === 'invoice' && dueDate && (
                        <Row label="Due Date" value={formatDate(dueDate)} />
                    )}

                    {notes && <Row label="Notes" value={<span className="text-[13px] text-gray-600">{notes}</span>} isLast />}
                </div>

                {/* FOOTER */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        If you have any questions or would like more information, please call{' '}
                        <span className="font-semibold text-brand-navy">{vendor.phone || 'our contact centre'}</span>
                        {vendor.email && (
                            <> or send an email to <span className="font-semibold text-brand-navy">{vendor.email}</span></>
                        )}.
                        {vendor.address && <><br />{vendor.address}</>}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-4">
                        Thank you for choosing {vendor.businessName || 'us'}.
                    </p>
                    <div className="text-[9px] text-gray-400 mt-2">
                        Powered by Aura Receipt
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPreview;