/**
 * AURA RECEIPT — Currency Utilities
 * ------------------------------------------------------------
 * Multi-currency support for African + global markets.
 * Handles symbols, formatting, and locale-aware thousand separators.
 *
 * Supported: NGN (₦), GHS (₵), USD ($), GBP (£), EUR (€)
 * ------------------------------------------------------------
 */

// Currency registry — symbol, code, name, and smallest unit divisor
export const CURRENCIES = {
    NGN: { symbol: '₦', code: 'NGN', name: 'Naira', decimals: 2 },
    GHS: { symbol: '₵', code: 'GHS', name: 'Cedi', decimals: 2 },
    USD: { symbol: '$', code: 'USD', name: 'Dollar', decimals: 2 },
    GBP: { symbol: '£', code: 'GBP', name: 'Pound', decimals: 2 },
    EUR: { symbol: '€', code: 'EUR', name: 'Euro', decimals: 2 },
};

// Ordered list for rendering dropdown options
export const CURRENCY_LIST = Object.values(CURRENCIES);

/**
 * Format an amount with the given currency code.
 * Example: formatAmount(45000, 'NGN') → "₦45,000.00"
 *
 * @param {number|string} amount
 * @param {string} currencyCode — key in CURRENCIES (default 'NGN')
 * @returns {string}
 */
export const formatAmount = (amount, currencyCode = 'NGN') => {
    const currency = CURRENCIES[currencyCode] || CURRENCIES.NGN;
    const num = Number(amount) || 0;

    // toLocaleString gives us comma-separated thousands + fixed decimals
    const formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals,
    });

    return `${currency.symbol}${formatted}`;
};

/**
 * Get just the symbol for a currency code.
 * Used in labels, badges, and inline UI.
 */
export const getSymbol = (currencyCode = 'NGN') => {
    return (CURRENCIES[currencyCode] || CURRENCIES.NGN).symbol;
};

/**
 * Get the currency display name (used in "amount in words").
 * Example: getCurrencyName('NGN') → "Naira"
 */
export const getCurrencyName = (currencyCode = 'NGN') => {
    return (CURRENCIES[currencyCode] || CURRENCIES.NGN).name;
};

/**
 * Parse a user-typed amount into a clean number.
 * Strips currency symbols, commas, and whitespace.
 * Returns 0 for invalid input.
 */
export const parseAmount = (value) => {
    if (value === '' || value === null || value === undefined) return 0;
    const cleaned = String(value).replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};