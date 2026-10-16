/**
 * AURA RECEIPT — Payment Block
 * ------------------------------------------------------------
 * Bank details + optional payment link.
 * These fields live inside the vendor profile (auto-saved),
 * so a returning vendor never re-types their account.
 *
 * The preview renders these as a clean "Pay To" section, and
 * if a payment link is provided, generates a QR code slot
 * (QR generation comes from ReceiptPreview side — we just
 * pass the data through).
 * ------------------------------------------------------------
 */

import { Building2, CreditCard, User, Link2, Wallet } from 'lucide-react';

const PaymentBlock = ({ receipt }) => {
    const { vendor, setVendor } = receipt;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

            {/* Card header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Wallet size={16} className="text-gray-400" />
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Payment Details
                </span>
            </div>

            <div className="p-5 space-y-5">

                {/* Bank Name */}
                <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                        <Building2 size={12} className="text-gray-400" />
                        Bank Name
                    </label>
                    <input
                        type="text"
                        value={vendor.bankName}
                        onChange={(e) => setVendor({ bankName: e.target.value })}
                        placeholder="e.g. Kuda, GTBank, Access Bank"
                        className="w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                    />
                </div>

                {/* Account Number + Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                            <CreditCard size={12} className="text-gray-400" />
                            Account Number
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={vendor.accountNumber}
                            onChange={(e) => setVendor({ accountNumber: e.target.value })}
                            placeholder="0123456789"
                            className="w-full px-3.5 py-2.5 text-[15px] font-mono border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                            <User size={12} className="text-gray-400" />
                            Account Name
                        </label>
                        <input
                            type="text"
                            value={vendor.accountName}
                            onChange={(e) => setVendor({ accountName: e.target.value })}
                            placeholder="Name on the account"
                            className="w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Payment Link */}
                <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                        <Link2 size={12} className="text-gray-400" />
                        Payment Link (optional)
                    </label>
                    <input
                        type="url"
                        value={vendor.paymentLink}
                        onChange={(e) => setVendor({ paymentLink: e.target.value })}
                        placeholder="https://paystack.com/pay/yourlink"
                        className="w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">
                        Paystack, Flutterwave, Selar, or any URL — customers can pay online
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PaymentBlock;