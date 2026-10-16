/**
 * AURA RECEIPT — Vendor Form (Simplified)
 * ------------------------------------------------------------
 * Only the essentials: business name + phone.
 * Everything else lives inside MoreOptions.
 * Auto-saved to LocalStorage via useReceipt.
 * ------------------------------------------------------------
 */

import { Store, Phone, Check, AlertCircle } from 'lucide-react';

const VendorForm = ({ receipt, errors }) => {
    const { vendor, setVendor } = receipt;
    const hasError = errors?.businessName;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Store size={16} className="text-gray-400" />
                    <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                        Your Business
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-green-600">
                    <Check size={12} />
                    Auto-saved
                </div>
            </div>

            <div className="p-5 space-y-4">

                {/* Business Name — required */}
                <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-1.5 block">
                        Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={vendor.businessName}
                        onChange={(e) => setVendor({ businessName: e.target.value })}
                        placeholder="e.g. Adaeze's Wigs"
                        className={`w-full px-3.5 py-2.5 text-[15px] border rounded-lg outline-none transition-colors ${hasError
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                                : 'border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10'
                            }`}
                    />
                    {hasError && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-red-500">
                            <AlertCircle size={12} />
                            {errors.businessName}
                        </div>
                    )}
                </div>

                {/* Phone — required */}
                <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                        <Phone size={12} className="text-gray-400" />
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={vendor.phone}
                        onChange={(e) => setVendor({ phone: e.target.value })}
                        placeholder="+234 803 000 0000"
                        className={`w-full px-3.5 py-2.5 text-[15px] border rounded-lg outline-none transition-colors ${errors?.phone
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                                : 'border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10'
                            }`}
                    />
                    {errors?.phone && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-red-500">
                            <AlertCircle size={12} />
                            {errors.phone}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VendorForm;