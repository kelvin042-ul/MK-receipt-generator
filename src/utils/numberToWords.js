/**
 * AURA RECEIPT — Number to Words
 * ------------------------------------------------------------
 * Converts a numeric amount to its written English form.
 * Used for the "Amount in words" line — a Nigerian banking
 * convention that makes receipts feel official and premium.
 *
 * Example:
 *   numberToWords(45000) → "Forty-Five Thousand"
 *   numberToWords(45000.50) → "Forty-Five Thousand, Fifty Kobo"
 *
 * Handles values up to 999 billion.
 * ------------------------------------------------------------
 */

// Word tables
const ONES = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
];

const TENS = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

// Smallest-unit names per currency (kobo, pesewa, cents, pence, cents)
const SUBUNIT_NAMES = {
    NGN: 'Kobo',
    GHS: 'Pesewa',
    USD: 'Cents',
    GBP: 'Pence',
    EUR: 'Cents',
};

/**
 * Convert a whole number (0–999) to words.
 * Helper for the chunked conversion below.
 */
const chunkToWords = (num) => {
    if (num === 0) return '';

    if (num < 20) return ONES[num];

    if (num < 100) {
        const tens = Math.floor(num / 10);
        const ones = num % 10;
        return TENS[tens] + (ones ? `-${ONES[ones]}` : '');
    }

    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    return `${ONES[hundreds]} Hundred${remainder ? ` And ${chunkToWords(remainder)}` : ''}`;
};

/**
 * Convert a full integer (up to billions) to words.
 */
const integerToWords = (num) => {
    if (num === 0) return 'Zero';

    const scales = ['', ' Thousand', ' Million', ' Billion'];
    const parts = [];
    let scaleIndex = 0;

    while (num > 0) {
        const chunk = num % 1000;
        if (chunk !== 0) {
            const chunkWords = chunkToWords(chunk);
            parts.unshift(chunkWords + scales[scaleIndex]);
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }

    return parts.join(', ').replace(/,([^,]*)$/, ' And$1').replace(/ And/g, (match, offset, str) => {
        // Only use "And" for the last segment if it's small (under 100)
        return match;
    });
};

/**
 * Main exported function.
 * Converts amount → words with currency name appended.
 *
 * @param {number|string} amount — numeric amount
 * @param {string} currencyCode  — NGN | GHS | USD | GBP | EUR
 * @returns {string} e.g. "Forty-Five Thousand Naira Only"
 */
export const numberToWords = (amount, currencyCode = 'NGN') => {
    const num = Number(amount) || 0;

    // Split into whole + fractional parts
    const whole = Math.floor(num);
    const fraction = Math.round((num - whole) * 100);

    // Currency names
    const currencyNames = {
        NGN: 'Naira', GHS: 'Cedi', USD: 'Dollars', GBP: 'Pounds', EUR: 'Euros',
    };
    const currencyName = currencyNames[currencyCode] || 'Naira';
    const subunitName = SUBUNIT_NAMES[currencyCode] || 'Kobo';

    // Whole part
    const wholeWords = integerToWords(whole);

    // Handle fractional (kobo/pesewa/cents/pence) if present
    if (fraction > 0) {
        const fractionWords = chunkToWords(fraction);
        return `${wholeWords} ${currencyName}, ${fractionWords} ${subunitName} Only`;
    }

    return `${wholeWords} ${currencyName} Only`;
};