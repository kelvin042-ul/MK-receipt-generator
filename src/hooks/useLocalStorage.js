/**
 * AURA RECEIPT — useLocalStorage Hook
 * ------------------------------------------------------------
 * Generic persisted state hook.
 * Behaves like useState but syncs to LocalStorage.
 *
 * Usage:
 *   const [name, setName] = useLocalStorage('myKey', 'default');
 *
 * Notes:
 *   - Reads once on mount (lazy initializer)
 *   - Writes on every value change
 *   - Fails silently if storage is full or unavailable
 * ------------------------------------------------------------
 */

import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    // Lazy init — read from storage once
    const [value, setValue] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return initialValue;
            return JSON.parse(raw);
        } catch {
            return initialValue;
        }
    });

    // Sync to storage on every change
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Silent fail — quota exceeded or disabled storage
        }
    }, [key, value]);

    return [value, setValue];
};