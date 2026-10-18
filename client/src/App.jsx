import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import EnquiryDrawer from './components/EnquiryDrawer.jsx';
import Home from './pages/Home.jsx';
import Catalogue from './pages/Catalogue.jsx';
import ProductPage from './pages/ProductPage.jsx';
import { About, FAQs, Contact, NotFound } from './pages/Static.jsx';

const Admin = lazy(() => import('./pages/Admin.jsx'));

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <>
      <ScrollTop />
      {!isAdmin && <Header />}
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:parent" element={<Catalogue />} />
          <Route path="/catalogue/:parent/:child" element={<Catalogue />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Suspense fallback={<p className="admin-route-loading">Loading admin workspace…</p>}><Admin /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <EnquiryDrawer />}
    </>
  );
}
