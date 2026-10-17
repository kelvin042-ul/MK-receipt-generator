/**
 * AURA RECEIPT — useReceipt Hook
 * ------------------------------------------------------------
 * The single source of truth for the entire document.
 * Every component reads from and writes to this hook.
 *
 * Responsibilities:
 *   - Hold vendor, customer, doc meta, items, totals, payment
 *   - Auto-compute subtotal / discount / tax / total
 *   - Persist vendor profile to LocalStorage
 *   - Issue auto-incrementing document numbers
 *   - Provide "New Document" and "Reset All" actions
 *
 * Usage:
 *   const receipt = useReceipt();
 *   receipt.setVendor({...})
 *   receipt.addItem()
 * ------------------------------------------------------------
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    loadVendor,
    saveVendor,
    clearVendor,
    issueNextDocNumber,
} from '../utils/storage';
import { parseAmount } from '../utils/currency';

/**
 * Default empty line item.
 */
const emptyItem = () => ({
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: '',
    qty: 1,
    price: 0,
});

/**
 * Today's date in YYYY-MM-DD format (used by <input type="date">).
 */
const today = () => new Date().toISOString().split('T')[0];

export const useReceipt = () => {
    // ============================================================
    // VENDOR — hydrated from LocalStorage on first mount
    // ============================================================
    const [vendor, setVendorState] = useState(() => {
        const saved = loadVendor();
        return (
            saved || {
                businessName: '',
                logoUrl: '',
                phone: '',
                email: '',
                address: '',
                bankName: '',
                accountNumber: '',
                accountName: '',
                paymentLink: '',
            }
        );
    });

    // ============================================================
    // CUSTOMER — not persisted (fresh per document)
    // ============================================================
    const [customer, setCustomerState] = useState({
        name: '',
        phone: '',
        whatsapp: '',
        address: '',
    });

    // ============================================================
    // DOCUMENT META
    // ============================================================
    const [docType, setDocType] = useState('receipt'); // 'receipt' | 'invoice'
    const [docNumber, setDocNumber] = useState('');
    const [date, setDate] = useState(today());
    const [dueDate, setDueDate] = useState('');
    const [currency, setCurrency] = useState('NGN');
    const [notes, setNotes] = useState('');

    // ============================================================
    // LINE ITEMS
    // ============================================================
    const [items, setItems] = useState([emptyItem()]);

    // ============================================================
    // DISCOUNT + TAX CONTROLS
    // ============================================================
    const [discountValue, setDiscountValue] = useState(0);
    const [discountType, setDiscountType] = useState('fixed'); // 'fixed' | 'percent'
    const [taxRate, setTaxRate] = useState(0); // percentage

    // ============================================================
    // ISSUE DOC NUMBER ON FIRST MOUNT + WHEN DOC TYPE CHANGES
    // ============================================================
    useEffect(() => {
        if (!docNumber) {
            setDocNumber(issueNextDocNumber(docType));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Switching type: swap the PREFIX only, keep the numeric part.
    // Does NOT burn a new counter value.
    const switchDocType = useCallback((nextType) => {
        setDocType(nextType);
        setDocNumber((prev) => {
            if (!prev) return issueNextDocNumber(nextType);
            // REC-2025-007 → INV-2025-007 (or vice versa)
            const replaced = prev.replace(/^(REC|INV)/, nextType === 'invoice' ? 'INV' : 'REC');
            return replaced;
        });
    }, []);

    // ============================================================
    // AUTO-SAVE VENDOR WHENEVER IT CHANGES
    // ============================================================
    useEffect(() => {
        saveVendor(vendor);
    }, [vendor]);

    // ============================================================
    // SETTERS (wrapped for clarity + future validation)
    // ============================================================
    const setVendor = useCallback((patch) => {
        setVendorState((prev) => ({ ...prev, ...patch }));
    }, []);

    const setCustomer = useCallback((patch) => {
        setCustomerState((prev) => ({ ...prev, ...patch }));
    }, []);

    // ============================================================
    // LINE ITEM ACTIONS
    // ============================================================
    const addItem = useCallback(() => {
        setItems((prev) => [...prev, emptyItem()]);
    }, []);

    const removeItem = useCallback((id) => {
        setItems((prev) => {
            // Keep at least one row so the UI never looks broken
            if (prev.length === 1) return [emptyItem()];
            return prev.filter((item) => item.id !== id);
        });
    }, []);

    const updateItem = useCallback((id, patch) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
        );
    }, []);

    // ============================================================
    // COMPUTED TOTALS — recalculated on every render
    // ============================================================
    const computed = useMemo(() => {
        const subtotal = items.reduce((sum, item) => {
            const qty = Number(item.qty) || 0;
            const price = parseAmount(item.price);
            return sum + qty * price;
        }, 0);

        const rawDiscount =
            discountType === 'percent'
                ? (subtotal * (Number(discountValue) || 0)) / 100
                : parseAmount(discountValue);

        const discount = Math.min(rawDiscount, subtotal); // capped once
        const afterDiscount = subtotal - discount;
        const tax = (afterDiscount * (Number(taxRate) || 0)) / 100;
        const total = afterDiscount + tax;

        return { subtotal, discount, tax, total };
    }, [items, discountValue, discountType, taxRate]);

    // ============================================================
    // ACTIONS — New Document / Reset All
    // ============================================================

    /**
     * Start a fresh document. Keeps vendor profile + currency.
     * Issues a new doc number.
     */
    const newDocument = useCallback(() => {
        setCustomerState({ name: '', phone: '', whatsapp: '', address: '' });
        setItems([emptyItem()]);
        setDiscountValue(0);
        setDiscountType('fixed');
        setTaxRate(0);
        setNotes('');
        setDate(today());
        setDueDate('');
        setDocNumber(issueNextDocNumber(docType));
    }, [docType]);

    // Add inside useReceipt, near newDocument:

    const loadDocument = useCallback((state) => {
        if (!state) return;
        setVendorState((prev) => ({ ...prev, ...state.vendor })); // keep vendor, overlay saved
        setCustomerState(state.customer || { name: '', phone: '', whatsapp: '', address: '' });
        setDocType(state.docType || 'receipt');
        setDocNumber(state.docNumber || '');
        setDate(state.date || today());
        setDueDate(state.dueDate || '');
        setCurrency(state.currency || 'NGN');
        setNotes(state.notes || '');
        setItems(state.items?.length ? state.items : [emptyItem()]);
        setDiscountValue(state.discountValue ?? 0);
        setDiscountType(state.discountType || 'fixed');
        setTaxRate(state.taxRate ?? 0);
    }, []);

    // And add `loadDocument` to the return object

    /**
     * Full reset — wipes everything including saved vendor profile.
     * Use with a confirmation dialog.
     */
    const resetAll = useCallback(() => {
        clearVendor();
        setVendorState({
            businessName: '',
            logoUrl: '',
            phone: '',
            email: '',
            address: '',
            bankName: '',
            accountNumber: '',
            accountName: '',
            paymentLink: '',
        });
        setCustomerState({ name: '', phone: '', whatsapp: '', address: '' });
        setItems([emptyItem()]);
        setDiscountValue(0);
        setDiscountType('fixed');
        setTaxRate(0);
        setNotes('');
        setDate(today());
        setDueDate('');
        setDocNumber(issueNextDocNumber(docType));
    }, [docType]);

    // ============================================================
    // RETURN — one object, everything the UI needs
    // ============================================================
    return {
        // State
        vendor,
        customer,
        docType,
        docNumber,
        date,
        dueDate,
        currency,
        notes,
        items,
        discountValue,
        discountType,
        taxRate,

        // Computed
        ...computed, // subtotal, discount, tax, total

        // Setters
        setVendor,
        setCustomer,
        switchDocType,
        setDocNumber,
        setDate,
        setDueDate,
        setCurrency,
        setNotes,
        setDiscountValue,
        setDiscountType,
        setTaxRate,

        // Line item actions
        addItem,
        removeItem,
        updateItem,

        // Document actions
        newDocument,
        loadDocument,
        resetAll,
    };
};