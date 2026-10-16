/**
 * AURA RECEIPT — App Shell
 * ------------------------------------------------------------
 * Only two responsibilities:
 *   1. Mount global providers (if any)
 *   2. Define routes
 *
 * All actual page composition lives in /pages.
 * ------------------------------------------------------------
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Generator from './pages/Generator';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main generator — the whole app for now */}
        <Route path="/" element={<Generator />} />

        {/* Future slots — easy to add later without touching layout */}
        {/* <Route path="/pricing" element={<Pricing />} /> */}
        {/* <Route path="/about"   element={<About />} /> */}

        {/* Fallback — redirect unknown routes home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;