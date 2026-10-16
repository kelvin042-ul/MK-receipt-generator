/**
 * AURA RECEIPT — Storage Utilities
 * ------------------------------------------------------------
 * Thin wrappers over LocalStorage with:
 *   - Safe JSON parsing (never throws)
 *   - Namespaced keys (so we don't clash with other apps)
 *   - A persisted auto-incrementing document number counter
 *
 * Keys:
 *   aura.vendor          → saved vendor/business profile
 *   aura.counter.receipt → last receipt number used
 *   aura.counter.invoice → last invoice number used
 * ------------------------------------------------------------
 */

const PREFIX = 'aura.';

const KEYS = {
    VENDOR: `${PREFIX}vendor`,
    COUNTER_RECEIPT: `${PREFIX}counter.receipt`,
    COUNTER_INVOICE: `${PREFIX}counter.invoice`,
};

/**
 * Safely read a JSON value from LocalStorage.
 * Returns fallback if missing or malformed.
 */
export const readJSON = (key, fallback = null) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
};

/**
 * Safely write a JSON value to LocalStorage.
 * Fails silently if quota is exceeded (large base64 logos).
 */
export const writeJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
};

/**
 * Remove a key.
 */
export const removeKey = (key) => {
    try {
        localStorage.removeItem(key);
    } catch {
        // no-op
    }
};

// ============================================================
// VENDOR PROFILE
// ============================================================

export const loadVendor = () => readJSON(KEYS.VENDOR, null);
export const saveVendor = (vendor) => writeJSON(KEYS.VENDOR, vendor);
export const clearVendor = () => removeKey(KEYS.VENDOR);

// ============================================================
// DOCUMENT NUMBER COUNTER
// ============================================================

/**
 * Get the current counter for a doc type.
 * @param {'receipt'|'invoice'} type
 * @returns {number}
 */
export const getCounter = (type) => {
    const key = type === 'invoice' ? KEYS.COUNTER_INVOICE : KEYS.COUNTER_RECEIPT;
    const value = readJSON(key, 0);
    return typeof value === 'number' ? value : 0;
};

/**
 * Increment the counter and return the new value.
 * Called when the user generates a new doc number.
 */
export const incrementCounter = (type) => {
    const key = type === 'invoice' ? KEYS.COUNTER_INVOICE : KEYS.COUNTER_RECEIPT;
    const next = getCounter(type) + 1;
    writeJSON(key, next);
    return next;
};

/**
 * Build a formatted document number.
 * Example: buildDocNumber('receipt', 7) → "REC-2025-007"
 */
export const buildDocNumber = (type, counter) => {
    const prefix = type === 'invoice' ? 'INV' : 'REC';
    const year = new Date().getFullYear();
    const padded = String(counter).padStart(3, '0');
    return `${prefix}-${year}-${padded}`;
};

/**
 * Get the next doc number AND increment the counter.
 * Call this only when the user explicitly starts a new document.
 */
export const issueNextDocNumber = (type) => {
    const next = incrementCounter(type);
    return buildDocNumber(type, next);
};