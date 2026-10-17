/**
 * AURA RECEIPT — Number to Words
 * ------------------------------------------------------------
 * Clean integer chunking. No "And" hacks.
 *   numberToWords(45000, 'NGN')    → "Forty-Five Thousand Naira Only"
 *   numberToWords(45000.5, 'NGN')  → "Forty-Five Thousand Naira, Fifty Kobo Only"
 * ------------------------------------------------------------
 */

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];

const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const SUBUNIT_NAMES = { NGN: 'Kobo', GHS: 'Pesewa', USD: 'Cents', GBP: 'Pence', EUR: 'Cents' };
const CURRENCY_NAMES = { NGN: 'Naira', GHS: 'Cedi', USD: 'Dollars', GBP: 'Pounds', EUR: 'Euros' };

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
    return `${ONES[hundreds]} Hundred${remainder ? ` and ${chunkToWords(remainder)}` : ''}`;
};

const integerToWords = (num) => {
    if (num === 0) return 'Zero';

    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    const parts = [];
    let scaleIndex = 0;

    while (num > 0) {
        const chunk = num % 1000;
        if (chunk !== 0) {
            const words = chunkToWords(chunk);
            parts.unshift(scales[scaleIndex] ? `${words} ${scales[scaleIndex]}` : words);
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }

    return parts.join(', ');
};

export const numberToWords = (amount, currencyCode = 'NGN') => {
    const num = Math.abs(Number(amount) || 0);
    const whole = Math.floor(num);
    const fraction = Math.round((num - whole) * 100);

    const currencyName = CURRENCY_NAMES[currencyCode] || 'Naira';
    const subunitName = SUBUNIT_NAMES[currencyCode] || 'Kobo';

    const wholeWords = integerToWords(whole);

    if (fraction > 0) {
        return `${wholeWords} ${currencyName}, ${chunkToWords(fraction)} ${subunitName} Only`;
    }
    return `${wholeWords} ${currencyName} Only`;
};