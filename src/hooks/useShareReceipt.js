/**
 * AURA RECEIPT — Share Receipt
 * ------------------------------------------------------------
 * Turns the receipt into a PNG and opens the native share sheet.
 *
 * Flow:
 *   1. Render #receipt-capture to PNG (full width, dynamic height)
 *   2. Try navigator.share({ files }) → native sheet with image attached
 *   3. If share is unsupported OR throws → download the PNG as fallback
 *
 * No canShare gate — it lies on too many browsers.
 * No upscale — output is sharp on WhatsApp.
 * ------------------------------------------------------------
 */

import { toPng } from 'html-to-image';

const TARGET_W = 1080;
const MIN_H = 1350; // 4:5 minimum — short receipts stay pretty

const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

/**
 * Render the receipt element to a PNG File.
 * Full width, height grows with content (min 4:5).
 * Never upscales — sharp text on WhatsApp.
 */
export const buildReceiptFile = async (element, fileName = 'receipt.png') => {
    if (!element) throw new Error('no-element');

    // Wait for fonts so Poppins actually renders in the snapshot
    if (document.fonts?.ready) {
        try { await document.fonts.ready; } catch { /* no-op */ }
    }

    // Render at 2x the element's CSS width → crisp source
    const rect = element.getBoundingClientRect();
    const pixelRatio = Math.max(2, TARGET_W / Math.max(rect.width, 1));

    const rawDataUrl = await toPng(element, {
        pixelRatio,
        cacheBust: true,        // force re-fetch of logo images
        backgroundColor: '#FBF7F0',
        skipFonts: false,
    });

    const img = await loadImage(rawDataUrl);

    // Full width, height follows content, floor at 4:5
    const drawW = TARGET_W;
    const naturalH = (img.height / img.width) * TARGET_W;
    const canvasH = Math.max(Math.round(naturalH), MIN_H);

    const canvas = document.createElement('canvas');
    canvas.width = TARGET_W;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d', { alpha: false });

    ctx.fillStyle = '#FBF7F0';
    ctx.fillRect(0, 0, TARGET_W, canvasH);

    // Draw at full width, top-aligned. Short receipts pad below with cream.
    ctx.drawImage(img, 0, 0, drawW, naturalH);

    const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png', 1.0)
    );

    if (!blob) throw new Error('to-blob-failed');

    return new File([blob], fileName, { type: 'image/png' });
};

/**
 * Trigger a browser download for a File.
 * Used as fallback when native share is unavailable.
 */
const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
};

/**
 * Open the native share sheet with the image.
 *
 * Returns:
 *   { method: 'share' }        → native sheet opened (user may cancel — fine)
 *   { method: 'download' }     → share unsupported, file downloaded instead
 *   { method: 'cancelled' }    → user closed the sheet (still a success)
 *
 * Never returns silently — the caller always knows what happened.
 */
export const openShareSheet = async (file) => {
    // No canShare gate. Try share; if it throws, fall back.
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
            await navigator.share({
                files: [file],
                title: 'Receipt',
            });
            return { method: 'share' };
        } catch (err) {
            // User cancelled — treat as success, do NOT download
            if (err?.name === 'AbortError') {
                return { method: 'cancelled' };
            }
            // NotAllowedError / NotSupportedError / TypeError → fall back
            console.warn('navigator.share failed, falling back to download:', err);
        }
    }

    // Fallback: download the PNG so the user always gets the file
    downloadFile(file);
    return { method: 'download' };
};