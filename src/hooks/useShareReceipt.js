/**
 * AURA RECEIPT — Share Receipt (bank-style)
 * ------------------------------------------------------------
 * Renders the receipt DOM to a PNG, triggers download, then
 * opens the native share sheet with the image (mobile) — exactly
 * how Kuda / Opay / PalmPay share receipts.
 *
 * Uses `html-to-image` (client-side, ~45KB, no server).
 *
 * Flow:
 *   1. Capture target element as PNG data URL
 *   2. Trigger download (image saved to device)
 *   3. If Web Share API supports files → open share sheet
 *   4. Return a status so the UI can show a toast
 * ------------------------------------------------------------
 */

import { toPng } from 'html-to-image';

export const shareReceiptAsImage = async (element, fileName) => {
    if (!element) {
        return { ok: false, reason: 'no-element' };
    }

    try {
        // Render at 2× pixel density for crisp text on retina screens
        const dataUrl = await toPng(element, {
            pixelRatio: 2,
            cacheBust: true,
            backgroundColor: '#ffffff',
            // Skip elements marked with data-no-capture (buttons etc.)
            filter: (node) => {
                if (node?.dataset?.noCapture === 'true') return false;
                return true;
            },
        });

        // Convert data URL → Blob for sharing
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: 'image/png' });

        // 1) Always trigger the download
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();

        // 2) Try native share sheet (mobile mostly)
        const canShareFiles =
            typeof navigator !== 'undefined' &&
            navigator.canShare &&
            navigator.canShare({ files: [file] });

        if (canShareFiles) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Receipt',
                    text: 'Here is your receipt.',
                });
                return { ok: true, shared: true };
            } catch (err) {
                // User cancelled share sheet — download already succeeded
                if (err?.name === 'AbortError') {
                    return { ok: true, shared: false, cancelled: true };
                }
                return { ok: true, shared: false };
            }
        }

        // Desktop fallback — download succeeded, no share sheet
        return { ok: true, shared: false, desktopFallback: true };
    } catch (err) {
        console.error('Share receipt failed:', err);
        return { ok: false, reason: 'error', error: err };
    }
};