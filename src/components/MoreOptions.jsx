/**
 * AURA RECEIPT — More Options (Collapsible)
 * ------------------------------------------------------------
 * Wraps advanced fields behind a single "More options" toggle.
 * Simple by default; power users tap to reveal.
 *
 * Contains:
 *   - Logo upload (with URL fallback)
 *   - Business email + address
 *   - Currency selector
 *   - Document number + date override
 *   - Bank details + payment link
 *   - Discount + tax + notes
 *
 * Every field is labeled "(optional)" so users know they can skip.
 * ------------------------------------------------------------
 */

import { useState, useRef } from 'react';
import {
    ChevronDown, Image as ImageIcon, Mail, MapPin, Coins, Hash, Calendar,
    Building2, CreditCard, User, Link2, Percent, StickyNote, Upload, X, Wallet
} from 'lucide-react';
import { CURRENCY_LIST, getSymbol } from '../utils/currency';

const MoreOptions = ({ receipt }) => {
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef(null);

    const {
        vendor, setVendor,
        docType, docNumber, setDocNumber,
        date, setDate, dueDate, setDueDate,
        currency, setCurrency,
        notes, setNotes,
        discountValue, setDiscountValue,
        discountType, setDiscountType,
        taxRate, setTaxRate,
    } = receipt;

    const symbol = getSymbol(currency);

    // Logo upload → base64 → LocalStorage (via setVendor)
    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 1_500_000) {
            alert('Logo is too large. Please use an image under 1.5MB.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setVendor({ logoUrl: reader.result });
        reader.readAsDataURL(file);
    };

    // Shared input style
    const inputCls = "w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors bg-white";
    const labelCls = "text-[11px] font-medium text-gray-600 mb-1.5 block";

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            {/* Toggle header */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-gray-400" />
                    <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                        More options
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 normal-case tracking-normal">
                        (logo, bank, tax, notes)
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Expanded content */}
            {open && (
                <div className="px-5 pb-5 space-y-6 border-t border-gray-100 pt-5">

                    {/* ============================================================
              LOGO + CONTACT
              ============================================================ */}
                    <section className="space-y-4">
                        <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            Business Details
                        </div>

                        {/* Logo */}
                        <div>
                            <label className={labelCls}>
                                Logo <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {vendor.logoUrl ? (
                                        <img src={vendor.logoUrl} alt="" className="w-full h-full object-contain" />
                                    ) : (
                                        <ImageIcon size={18} className="text-gray-300" />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={vendor.logoUrl?.startsWith('data:') ? '' : (vendor.logoUrl || '')}
                                    onChange={(e) => setVendor({ logoUrl: e.target.value })}
                                    placeholder="Paste image URL"
                                    className={`${inputCls} flex-1 min-w-0`}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-[12px] font-medium flex-shrink-0"
                                >
                                    <Upload size={14} />
                                    <span className="hidden sm:inline">Upload</span>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                {vendor.logoUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setVendor({ logoUrl: '' })}
                                        className="p-2.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                        title="Remove logo"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Email + Address */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={`${labelCls} flex items-center gap-1.5`}>
                                    <Mail size={12} className="text-gray-400" />
                                    Email <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <input
                                    type="email"
                                    value={vendor.email}
                                    onChange={(e) => setVendor({ email: e.target.value })}
                                    placeholder="hello@business.com"
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <label className={`${labelCls} flex items-center gap-1.5`}>
                                    <MapPin size={12} className="text-gray-400" />
                                    Address <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={vendor.address}
                                    onChange={(e) => setVendor({ address: e.target.value })}
                                    placeholder="Shop address"
                                    className={inputCls}
                                />
                            </div>
                        </div>
                    </section>

                    {/* ============================================================
              DOCUMENT OVERRIDES
              ============================================================ */}
                    <section className="space-y-4 pt-2 border-t border-gray-100">
                        <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase pt-4">
                            Document Settings
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Doc number */}
                            <div>
                                <label className={`${labelCls} flex items-center gap-1.5`}>
                                    <Hash size={12} className="text-gray-400" />
                                    {docType === 'invoice' ? 'Invoice No.' : 'Receipt No.'}
                                </label>
                                <input
                                    type="text"
                                    value={docNumber}
                                    onChange={(e) => setDocNumber(e.target.value)}
                                    className={`${inputCls} font-mono`}
                                />
                            </div>

                            {/* Currency */}
                            <div>
                                <label className={`${labelCls} flex items-center gap-1.5`}>
                                    <Coins size={12} className="text-gray-400" />
                                    Currency
                                </label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className={inputCls}
                                >
                                    {CURRENCY_LIST.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.symbol} {c.code} — {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className={`${labelCls} flex items-center gap-1.5`}>
                                    <Calendar size={12} className="text-gray-400" />
                                    Date Issued
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={inputCls}
                                />
                            </div>

                            {/* Due date (invoices only) */}
                            {docType === 'invoice' && (
                                <div>
                                    <label className={`${labelCls} flex items-center gap-1.5`}>
                                        <Calendar size={12} className="text-gray-400" />
                                        Due Date <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ============================================================
              DISCOUNT + TAX
              ============================================================ */}
                    <section className="space-y-4 pt-2 border-t border-gray-100">
                        <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase pt-4">
                            Adjustments <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Discount */}
                            <div>
                                <label className={labelCls}>Discount</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        placeholder="0"
                                        className={`${inputCls} flex-1 min-w-0`}
                                    />
                                    <div className="flex border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setDiscountType('fixed')}
                                            className={`px-3 py-2.5 text-[12px] font-semibold transition-colors ${discountType === 'fixed' ? 'bg-brand-ink text-white' : 'bg-white text-gray-500'
                                                }`}
                                        >
                                            {symbol}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDiscountType('percent')}
                                            className={`px-3 py-2.5 text-[12px] font-semibold transition-colors flex items-center gap-1 ${discountType === 'percent' ? 'bg-brand-ink text-white' : 'bg-white text-gray-500'
                                                }`}
                                        >
                                            <Percent size={11} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tax */}
                            <div>
                                <label className={labelCls}>Tax / VAT (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(e.target.value)}
                                        placeholder="0"
                                        className={`${inputCls} pr-10`}
                                    />
                                    <Percent size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className={`${labelCls} flex items-center gap-1.5`}>
                                <StickyNote size={12} className="text-gray-400" />
                                Notes <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Payment due within 7 days"
                                className={`${inputCls} resize-none`}
                            />
                        </div>
                    </section>

                    {/* ============================================================
              BANK + PAYMENT
              ============================================================ */}
                    <section className="space-y-4 pt-2 border-t border-gray-100">
                        <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase pt-4">
                            Payment Details <span className="text-gray-400 font-normal normal-case tracking-normal">(optional)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={`${labelCls} flex items-center gap-1.5`}>
                                    <Building2 size={12} className="text-gray-400" />
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    value={vendor.bankName}
                                    onChange={(e) => setVendor({ bankName: e.target.value })}
                                    placeholder="Kuda, GTBank…"
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <label className={`${labelCls} flex items-center gap-1.5`}>
                                    <CreditCard size={12} className="text-gray-400" />
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={vendor.accountNumber}
                                    onChange={(e) => setVendor({ accountNumber: e.target.value })}
                                    placeholder="0123456789"
                                    className={`${inputCls} font-mono`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`${labelCls} flex items-center gap-1.5`}>
                                <User size={12} className="text-gray-400" />
                                Account Name
                            </label>
                            <input
                                type="text"
                                value={vendor.accountName}
                                onChange={(e) => setVendor({ accountName: e.target.value })}
                                placeholder="Name on the account"
                                className={inputCls}
                            />
                        </div>

                        <div>
                            <label className={`${labelCls} flex items-center gap-1.5`}>
                                <Link2 size={12} className="text-gray-400" />
                                Payment Link
                            </label>
                            <input
                                type="url"
                                value={vendor.paymentLink}
                                onChange={(e) => setVendor({ paymentLink: e.target.value })}
                                placeholder="https://paystack.com/pay/…"
                                className={inputCls}
                            />
                            <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">
                                Paystack, Flutterwave, Selar, or any URL — customers can pay online
                            </p>
                        </div>
                    </section>

                </div>
            )}
        </div>
    );
};

export default MoreOptions;