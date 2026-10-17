import { toPng } from 'html-to-image';

const TARGET_W = 1080;
const TARGET_H = 1350; // Strict 4:5 Ratio

const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

export const buildReceiptFile = async (element, fileName = 'receipt.png') => {
    if (!element) throw new Error('no-element');
    if (document.fonts?.ready) await document.fonts.ready;

    const rect = element.getBoundingClientRect();
    const pixelRatio = Math.max(2, TARGET_W / Math.max(rect.width, 1));

    const rawDataUrl = await toPng(element, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: '#FFFFFF', // Clean white
    });

    const img = await loadImage(rawDataUrl);

    const canvas = document.createElement('canvas');
    canvas.width = TARGET_W;
    canvas.height = TARGET_H;
    const ctx = canvas.getContext('2d', { alpha: false });

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, TARGET_W, TARGET_H);

    // Scale to fit width, center vertically
    const drawW = TARGET_W;
    const drawH = (img.height / img.width) * TARGET_W;
    const dy = Math.max(0, (TARGET_H - drawH) / 2); // Center it

    ctx.drawImage(img, 0, dy, drawW, drawH);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
    return new File([blob], fileName, { type: 'image/png' });
};

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

export const openShareSheet = async (file) => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
            await navigator.share({ files: [file], title: 'Receipt' });
            return { method: 'share' };
        } catch (err) {
            if (err?.name === 'AbortError') return { method: 'cancelled' };
            console.warn('Share failed, falling back:', err);
        }
    }
    downloadFile(file);
    return { method: 'download' };
};