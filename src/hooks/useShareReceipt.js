import { toPng } from 'html-to-image';

export const buildReceiptFile = async (element, fileName = 'receipt.png') => {
    if (!element) throw new Error('no-element');
    if (document.fonts?.ready) await document.fonts.ready;

    const rawDataUrl = await toPng(element, {
        pixelRatio: 1,               // 1080px is already high enough for WhatsApp
        cacheBust: true,
        backgroundColor: '#FFFFFF',
        width: 1080,                 // force exact size
        height: 1350,
        style: {
            // prevent any accidental scaling
            transform: 'scale(1)',
            transformOrigin: 'top left',
        },
    });

    const res = await fetch(rawDataUrl);
    const blob = await res.blob();

    return new File([blob], fileName, { type: 'image/png' });
};

// openShareSheet stays the same

export const openShareSheet = async (file) => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
            await navigator.share({ files: [file], title: 'Receipt' });
            return { method: 'share' };
        } catch (err) {
            if (err?.name === 'AbortError') return { method: 'cancelled' };
        }
    }

    // Fallback for desktop
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return { method: 'download' };
};