import { formatAmount } from '../utils/currency';
import { numberToWords } from '../utils/numberToWords';

const ReceiptCanvas = ({ receipt }) => {
    const {
        vendor, customer, docType, docNumber, date, dueDate, currency, notes,
        items, subtotal, discount, tax, total,
    } = receipt;

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }).replace(/\//g, '-');
    };

    const Row = ({ label, value, isLast }) => (
        <div className={`flex flex-row items-start py-3.5 ${!isLast ? 'border-b border-gray-200' : ''}`}>
            <div className="w-48 flex-shrink-0 text-[14px] font-bold text-brand-orange">
                {label}
            </div>
            <div className="flex-1 text-[15px] text-brand-navy break-words font-medium">
                {value}
            </div>
        </div>
    );

    return (
        <div
            id="receipt-capture-canvas"   // ← changed (unique ID)
            className="w-[1080px] h-[1350px] bg-white flex flex-col p-16 box-border"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }} // optional safety
        >
            <div className="flex-1">
                {/* HEADER */}
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-2">
                        {vendor.logoUrl ? (
                            <img src={vendor.logoUrl} alt="Logo" className="h-12 max-w-[160px] object-contain" />
                        ) : (
                            <div className="text-2xl font-bold text-brand-navy uppercase tracking-wide">
                                {vendor.businessName || 'Your Business'}
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-[12px] font-bold text-brand-orange tracking-wider">
                            {vendor.phone ? 'Contact Us' : 'Thank You'}
                        </div>
                    </div>
                </div>

                {/* TITLE */}
                <div className="text-center mb-10">
                    <h1 className="text-[26px] font-bold text-brand-navy uppercase tracking-tight mb-2">
                        {docType === 'invoice' ? 'INVOICE' : 'TRANSACTION RECEIPT'}
                    </h1>
                    <p className="text-[13px] text-gray-500">
                        Generated on {formatDate(date)} · {docNumber || '—'}
                    </p>
                </div>

                <div className="border-t border-gray-200">
                    <Row label="Transaction Amount" value={<span className="text-[20px] font-bold">{formatAmount(total, currency)}</span>} />

                    <Row label="Billed To" value={
                        <>
                            <div className="font-bold text-[16px]">{customer.name || 'Customer Name'}</div>
                            {customer.phone && <div className="text-[14px] text-gray-600 mt-1">{customer.phone}</div>}
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

                    <Row label="Amount in Words" value={<span className="text-[14px] italic">{numberToWords(total, currency)}</span>} />

                    {notes && <Row label="Notes" value={<span className="text-[14px] text-gray-600">{notes}</span>} isLast />}
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-auto pt-6 border-t border-gray-200">
                <p className="text-[12px] text-gray-500 leading-relaxed">
                    If you have any questions, please call <span className="font-semibold text-brand-navy">{vendor.phone || 'our contact centre'}</span>.
                </p>
                <div className="text-[10px] text-gray-400 mt-2">
                    Powered by Aura Receipt
                </div>
            </div>
        </div>
    );
};

export default ReceiptCanvas;