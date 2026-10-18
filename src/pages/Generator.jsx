import { useState, useMemo, useEffect, useCallback } from 'react';
import { useReceipt } from '../hooks/useReceipt';
import { loadRecent } from '../utils/storage';
import Header from '../components/Header';
import WelcomeModal from '../components/WelcomeModal';
import VendorForm from '../components/VendorForm';
import CustomerForm from '../components/CustomerForm';
import LineItemsTable from '../components/LineItemsTable';
import MoreOptions from '../components/MoreOptions';
import TotalsBlock from '../components/TotalsBlock';
import ReceiptPreview from '../components/ReceiptPreview';
import ActionBar from '../components/ActionBar';
import DocTypeToggle from '../components/DocTypeToggle';
import RecentReceipts from '../components/RecentReceipts';
import Paywall from '../components/Paywall';

const VISITED_KEY = 'mk.visited';

const Generator = () => {
    const receipt = useReceipt();

    // 1. Check if this phone already unlocked the app
    const [isUnlocked, setIsUnlocked] = useState(() => {
        return localStorage.getItem('mk_license') !== null;
    });

    // 2. If not unlocked, show ONLY the paywall
    if (!isUnlocked) {
        return <Paywall onUnlock={() => setIsUnlocked(true)} />;
    }

    // ... rest of your Generator code continues below ...

    // ------------------------------------------------------------
    // Welcome modal — read synchronously before first paint
    // ------------------------------------------------------------
    const [showWelcome, setShowWelcome] = useState(() => {
        try {
            return !localStorage.getItem(VISITED_KEY);
        } catch {
            return false;
        }
    });

    // ------------------------------------------------------------
    // Recent receipts — loaded once, refreshed after each share
    // ------------------------------------------------------------
    const [recent, setRecent] = useState(() => loadRecent());

    const refreshRecent = useCallback(() => {
        setRecent(loadRecent());
    }, []);

    const handleRestore = useCallback((state) => {
        receipt.loadDocument(state);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [receipt]);

    // ------------------------------------------------------------
    // Validation — recompute on every relevant state change
    // ------------------------------------------------------------
    const [attempted, setAttempted] = useState(false);

    const validation = useMemo(() => {
        const errors = {};
        let isValid = true;

        if (!receipt.vendor.businessName?.trim()) {
            errors.businessName = 'Business name is required';
            isValid = false;
        }
        if (!receipt.vendor.phone?.trim()) {
            errors.phone = 'Phone is required';
            isValid = false;
        }
        if (!receipt.customer.name?.trim()) {
            errors.customerName = 'Customer name is required';
            isValid = false;
        }

        // Items — need at least one with a valid price
        const itemErrors = [];
        let validItemsCount = 0;

        receipt.items.forEach((item, index) => {
            const hasDescription = item.description?.trim();
            const price = Number(item.price) || 0;

            if (price > 0) validItemsCount++;

            // Per-item error only when there's partial info but missing something
            if ((hasDescription || price > 0) && (!hasDescription || price <= 0)) {
                itemErrors[index] = 'Complete both description and price';
            } else {
                itemErrors[index] = null;
            }
        });

        if (validItemsCount === 0) {
            errors.itemsGeneral = 'Add at least one item with a price';
            isValid = false;
        }

        if (itemErrors.some(Boolean)) {
            errors.items = itemErrors;
            isValid = false;
        }

        return { errors, isValid };
    }, [receipt.vendor, receipt.customer, receipt.items]);

    // Reset "attempted" flag once the doc becomes valid,
    // so errors clear the moment the user fixes everything.
    useEffect(() => {
        if (validation.isValid) setAttempted(false);
    }, [validation.isValid]);

    // Errors stay hidden until the user taps Share while invalid.
    const visibleErrors = attempted ? validation.errors : {};

    const handleAttempt = useCallback(() => {
        setAttempted(true);
    }, []);

    return (
        <div className="min-h-screen water-bg print:bg-white">

            {/* Welcome modal — only on first ever visit */}
            {showWelcome && (
                <WelcomeModal onClose={() => setShowWelcome(false)} />
            )}

            {/* Header */}
            <div className="print:hidden">
                <Header />
            </div>

            {/* Main */}
            <main className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 pb-28 lg:pb-10 print:p-0 print:max-w-none">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 lg:gap-10 print:block">

                    {/* ============================================================
                        LEFT — Form (simple by default)
                        ============================================================ */}
                    <section className="space-y-4 print:hidden min-w-0">

                        <DocTypeToggle receipt={receipt} />

                        {/* Business + phone */}
                        <VendorForm receipt={receipt} errors={visibleErrors} />

                        {/* Customer */}
                        <CustomerForm receipt={receipt} errors={visibleErrors} />

                        {/* Items */}
                        <LineItemsTable receipt={receipt} errors={visibleErrors} />

                        {/* Live totals summary */}
                        <TotalsBlock receipt={receipt} />

                        {/* Advanced — collapsible */}
                        <MoreOptions receipt={receipt} />

                        {/* Recent — restorable docs */}
                        <RecentReceipts recent={recent} onRestore={handleRestore} />

                        {/* Desktop action bar */}
                        <div className="hidden lg:block">
                            <ActionBar
                                receipt={receipt}
                                validation={validation}
                                onAttempt={handleAttempt}
                                onSaved={refreshRecent}
                            />
                        </div>

                        {/* Extra bottom space for the mobile fixed bar */}
                        <div className="h-20 lg:h-4" />
                    </section>

                    {/* ============================================================
                        RIGHT — Preview (this prints)
                        ============================================================ */}
                    <section className="lg:sticky lg:top-6 lg:self-start print:static print:top-0 min-w-0">
                        <ReceiptPreview receipt={receipt} />
                    </section>

                </div>
            </main>

            {/* Mobile fixed action bar */}
            <ActionBar
                receipt={receipt}
                validation={validation}
                onAttempt={handleAttempt}
                onSaved={refreshRecent}
            />

        </div>
    );
};

export default Generator;