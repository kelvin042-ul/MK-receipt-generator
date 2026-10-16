/**
 * AURA RECEIPT — Customer Form (Simplified)
 * ------------------------------------------------------------
 * Customer name + phone + WhatsApp.
 * Phone is used for WhatsApp deep-linking.
 * ------------------------------------------------------------
 */

import { User, Phone, MessageCircle, AlertCircle } from 'lucide-react';

const CustomerForm = ({ receipt, errors }) => {
    const { customer, setCustomer } = receipt;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Customer
                </span>
            </div>

            <div className="p-5 space-y-4">

                {/* Name */}
                <div>
                    <label className="text-[11px] font-medium text-gray-600 mb-1.5 block">
                        Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => setCustomer({ name: e.target.value })}
                        placeholder="e.g. Chioma Okafor"
                        className={`w-full px-3.5 py-2.5 text-[15px] border rounded-lg outline-none transition-colors ${errors?.customerName
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                                : 'border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10'
                            }`}
                    />
                    {errors?.customerName && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-red-500">
                            <AlertCircle size={12} />
                            {errors.customerName}
                        </div>
                    )}
                </div>

                {/* Phone + WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" />
                            Phone <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="tel"
                            value={customer.phone}
                            onChange={(e) => setCustomer({ phone: e.target.value })}
                            placeholder="+234 803 000 0000"
                            className="w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-medium text-gray-600 mb-1.5 block flex items-center gap-1.5">
                            <MessageCircle size={12} className="text-green-500" />
                            WhatsApp <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="tel"
                            value={customer.whatsapp}
                            onChange={(e) => setCustomer({ whatsapp: e.target.value })}
                            placeholder="Same as phone if blank"
                            className="w-full px-3.5 py-2.5 text-[15px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CustomerForm;