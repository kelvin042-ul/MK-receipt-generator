/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    // Primary accent — used sparingly for totals, CTAs, payment block
                    purple: '#6B46C1',
                    // Deep near-black — used for receipt headings for crisp print
                    ink: '#0A0A0A',
                    // Muted gray — secondary labels, helper text
                    muted: '#6B7280',
                    // Soft surface — subtle panel backgrounds
                    surface: '#FAFAFA',
                },
            },
            fontFamily: {
                sans: ['Poppins', 'system-ui', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
            },
            // Receipt-specific spacing for a tighter, premium look
            letterSpacing: {
                'receipt': '0.08em',
            },
            // Subtle shadow used on the preview container
            boxShadow: {
                'receipt': '0 4px 24px -8px rgba(0, 0, 0, 0.08), 0 2px 8px -4px rgba(0, 0, 0, 0.04)',
                'panel': '0 1px 3px rgba(0, 0, 0, 0.04)',
            },
        },
    },
    plugins: [],
}