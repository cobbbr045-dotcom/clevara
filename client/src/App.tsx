import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.js';
import { CartProvider } from './context/CartContext.js';
import { AuthProvider } from './context/AuthContext.js';

// Common Components
import { AnnouncementBar } from './components/common/AnnouncementBar.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';

// Public Pages
import { HomePage } from './pages/public/HomePage.js';
import { ShopPage } from './pages/public/ShopPage.js';
import { CategoryPage } from './pages/public/CategoryPage.js';
import { ProductDetailPage } from './pages/public/ProductDetailPage.js';
import { AboutPage } from './pages/public/AboutPage.js';
import { FAQPage } from './pages/public/FAQPage.js';
import { ContactPage } from './pages/public/ContactPage.js';
import { TrackOrderPage } from './pages/public/TrackOrderPage.js';

// Customer Pages
import { CartPage } from './pages/customer/CartPage.js';
import { CheckoutPage } from './pages/customer/CheckoutPage.js';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage.js';
import { CancellationRequestPage } from './pages/customer/CancellationRequestPage.js';
import { ReturnRefundRequestPage } from './pages/customer/ReturnRefundRequestPage.js';

// Policy Pages
import {
  ShippingPolicyPage,
  PaymentPolicyPage,
  CancellationPolicyPage,
  ReturnsPolicyPage,
  RefundPolicyPage,
  DamagedProductPolicyPage,
  PrivacyPolicyPage,
  TermsPage
} from './pages/policy/PolicyPages.js';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage.js';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.js';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage.js';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage.js';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.js';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage.js';
import { AdminPromotionsPage } from './pages/admin/AdminPromotionsPage.js';
import { AdminDeliveryPage } from './pages/admin/AdminDeliveryPage.js';
import { AdminCancellationsPage } from './pages/admin/AdminCancellationsPage.js';
import { AdminRefundsPage } from './pages/admin/AdminRefundsPage.js';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage.js';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage.js';
import { AdminContentPage } from './pages/admin/AdminContentPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && (
        <>
          <AnnouncementBar />
          <Navbar />
        </>
      )}
      <div className="flex-1">
        {children}
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppLayout>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />

                {/* Customer Commerce */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/cancellations" element={<CancellationRequestPage />} />
                <Route path="/returns" element={<ReturnRefundRequestPage />} />

                {/* Policy Pages */}
                <Route path="/policies/shipping" element={<ShippingPolicyPage />} />
                <Route path="/policies/payment" element={<PaymentPolicyPage />} />
                <Route path="/policies/cancellation" element={<CancellationPolicyPage />} />
                <Route path="/policies/returns" element={<ReturnsPolicyPage />} />
                <Route path="/policies/refund" element={<RefundPolicyPage />} />
                <Route path="/policies/damaged-products" element={<DamagedProductPolicyPage />} />
                <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/policies/terms" element={<TermsPage />} />

                {/* Admin Pages */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminOverviewPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                <Route path="/admin/inventory" element={<AdminInventoryPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/customers" element={<AdminCustomersPage />} />
                <Route path="/admin/promotions" element={<AdminPromotionsPage />} />
                <Route path="/admin/delivery" element={<AdminDeliveryPage />} />
                <Route path="/admin/cancellations" element={<AdminCancellationsPage />} />
                <Route path="/admin/refunds" element={<AdminRefundsPage />} />
                <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
                <Route path="/admin/reviews" element={<AdminReviewsPage />} />
                <Route path="/admin/content" element={<AdminContentPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />

                {/* Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </AppLayout>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
