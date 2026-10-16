/**
 * AURA RECEIPT — WhatsApp Share
 * ------------------------------------------------------------
 * Builds a clean, formatted text summary of the receipt and
 * constructs a wa.me deep link to send it to the customer.
 *
 * Formatting notes:
 *   - WhatsApp supports *bold* and _italic_ with asterisks/underscores
 *   - %0A = newline (URL-encoded)
 *   - Numbers stripped of non-digits for the deep link
 * ------------------------------------------------------------
 */

import { formatAmount } from './currency';
import { numberToWords } from './numberToWords';

/**
 * Clean a phone number for wa.me — digits only, no leading +.
 * If the number starts with 0 (local format), assume Nigeria (+234)
 * unless the vendor has already added a country code.
 *
 * @param {string} phone
 * @returns {string} digits-only international number
 */
export const normalizePhone = (phone) => {
    if (!phone) return '';
    let digits = String(phone).replace(/\D/g, '');

    // Local Nigerian format: 0803... → 234803...
    if (digits.startsWith('0') && digits.length === 11) {
        digits = '234' + digits.slice(1);
    }

    return digits;
};

/**
 * Build a WhatsApp-ready text summary of the receipt.
 * Uses *bold* for headings and emojis sparingly for a friendly feel.
 *
 * @param {object} receipt — full receipt state
 * @returns {string} formatted message body
 */
export const buildWhatsAppMessage = (receipt) => {
    const {
        docType = 'Receipt',
        docNumber,
        date,
        currency = 'NGN',
        vendor = {},
        customer = {},
        items = [],
        subtotal = 0,
        discount = 0,
        tax = 0,
        total = 0,
        payment = {},
    } = receipt;

    const lines = [];

    // Header
    lines.push(`*${vendor.businessName || 'Your Business'}*`);
    if (vendor.phone) lines.push(`📞 ${vendor.phone}`);
    if (vendor.address) lines.push(`📍 ${vendor.address}`);
    lines.push('');
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`*${docType.toUpperCase()} ${docNumber}*`);
    lines.push(`📅 ${date}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push('');

    // Customer
    if (customer.name) {
        lines.push(`*Bill To:*`);
        lines.push(customer.name);
        if (customer.phone) lines.push(customer.phone);
        lines.push('');
    }

    // Items
    if (items.length > 0) {
        lines.push(`*Items:*`);
        items.forEach((item) => {
            const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
            lines.push(
                `• ${item.description || 'Item'} — ${item.qty} × ${formatAmount(item.price, currency)} = *${formatAmount(lineTotal, currency)}*`
            );
        });
        lines.push('');
    }

    // Totals
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`Subtotal: ${formatAmount(subtotal, currency)}`);
    if (discount > 0) lines.push(`Discount: -${formatAmount(discount, currency)}`);
    if (tax > 0) lines.push(`Tax/VAT: ${formatAmount(tax, currency)}`);
    lines.push(`*TOTAL: ${formatAmount(total, currency)}*`);
    lines.push('');

    // Amount in words
    lines.push(`_${numberToWords(total, currency)}_`);
    lines.push('');

    // Payment details
    if (payment.bankName || payment.accountNumber || payment.paymentLink) {
        lines.push(`*Payment Details:*`);
        if (payment.bankName) lines.push(`Bank: ${payment.bankName}`);
        if (payment.accountNumber) lines.push(`Account: ${payment.accountNumber}`);
        if (payment.accountName) lines.push(`Name: ${payment.accountName}`);
        if (payment.paymentLink) lines.push(`Pay Online: ${payment.paymentLink}`);
        lines.push('');
    }

    // Footer
    lines.push(`Thank you for your business! 🙏`);
    if (vendor.email) lines.push(`✉️ ${vendor.email}`);

    return lines.join('\n');
};

/**
 * Build a wa.me deep link with the encoded message.
 * If no customer phone, returns a wa.me link that opens WhatsApp
 * with the message pre-filled and lets the user pick a contact.
 *
 * @param {object} receipt — full receipt state
 * @returns {string} full wa.me URL
 */
export const buildWhatsAppLink = (receipt) => {
    const message = buildWhatsAppMessage(receipt);
    const encoded = encodeURIComponent(message);

    const customerPhone = normalizePhone(receipt.customer?.whatsapp || receipt.customer?.phone);

    if (customerPhone) {
        return `https://wa.me/${customerPhone}?text=${encoded}`;
    }

    // No customer phone — open WhatsApp and let user choose contact
    return `https://wa.me/?text=${encoded}`;
};

/**
 * Trigger WhatsApp share — opens in a new tab.
 */
export const shareToWhatsApp = (receipt) => {
    const link = buildWhatsAppLink(receipt);
    window.open(link, '_blank', 'noopener,noreferrer');
};