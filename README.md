# CLEVARA — Premium Private-Label Consumer Products Platform (Nepal)

![CLEVARA Brand](https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80)

CLEVARA is a specialized, private-label consumer goods brand and full-stack ecommerce platform designed, engineered, and tailored for the market in **Nepal**. 

The platform covers three main product lines:
1. **Home Cleaning**: Household botanical surface cleaners, concentrated kitchen degreasers, bathroom essentials, and dense microfiber towels.
2. **Body Cleaning**: Dermacare pH 5.5 balanced body washes, botanical hand washes, and natural sisal/loofah accessories.
3. **Car Cleaning**: Ceramic-safe pH 7.0 high-foam auto shampoos, UV-blocking satin interior dressings, and 1200 GSM twisted-loop drying towels.

---

## 1. Technical Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **Backend**: Node.js & Express RESTful API with modular route controllers.
- **Database Architecture**: Supabase PostgreSQL with normalized relational tables, constraints, foreign keys, and Row Level Security (RLS) policies. Includes an integrated resilient database adapter layer for immediate local operations and transparent Supabase live synchronization.
- **Payments**: Tailored for Nepal:
  - **Cash on Delivery (COD)**: Available nationwide across all delivery zones.
  - **eSewa ePay v2**: Modular digital wallet gateway with HMAC-SHA256 cryptographic signature generation and server-side transaction status verification.
- **Delivery Management**: Dynamic Nepal delivery zones (Kathmandu Valley Inside Ring Road, Outside Ring Road / Lalitpur / Bhaktapur, Major Hubs outside Valley, Rest of Nepal) with independent fee calculation.
- **Cancellations & 50% Refund Standard**: Dedicated workflow allowing customer requests, photo evidence uploads, administrative review, automatic stock replenishment on cancellation, and formal 50% refund calculations on eligible returned goods.

---

## 2. Directory Layout

```
clevera/
├── client/
│   ├── index.html
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── src/
│       ├── api/               # Typed API client with Bearer auth injection
│       ├── components/
│       │   ├── common/        # AnnouncementBar, Navbar, Footer, Toast
│       │   ├── product/       # ProductCard, SpecsTable, VariantSelector
│       │   └── admin/         # AdminLayout, MetricCards
│       ├── context/           # CartContext, AuthContext, ToastContext
│       ├── pages/
│       │   ├── public/        # HomePage, ShopPage, CategoryPage, ProductDetailPage, AboutPage, FAQPage, ContactPage, TrackOrderPage
│       │   ├── customer/      # CartPage, CheckoutPage, OrderConfirmationPage, CancellationRequestPage, ReturnRefundRequestPage
│       │   ├── policy/        # Shipping, Payment, Cancellation, Returns, 50% Refund, Damaged Goods, Privacy, Terms
│       │   └── admin/         # Overview, Products, Categories, Inventory, Orders, Customers, Promotions, Delivery, Refunds, Cancellations, Complaints, Reviews, Content, Settings
│       ├── types/             # Domain TypeScript interfaces
│       ├── utils/             # Formatters for NPR Currency and Dates
│       ├── App.tsx            # Full React router hierarchy
│       └── main.tsx
├── server/
│   ├── db/
│   │   ├── database.ts        # Database adapter, atomic stock deduction, local store
│   │   └── supabaseClient.ts  # Supabase client connector
│   ├── middleware/            # requireAuth, requireAdmin
│   ├── routes/                # auth, products, categories, orders, delivery, cancellations, refunds, promotions, events, reviews, contact, content, admin, payments
│   ├── services/              # AuthService (bcrypt, JWT), EsewaService (HMAC-SHA256)
│   ├── tests/
│   │   └── run_tests.ts       # 15-stage verification test suite
│   ├── types/
│   └── index.ts               # Express API Server entrypoint
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # Normalized PostgreSQL DDL schema & indexes
│       ├── 002_rls_policies.sql    # Complete Row Level Security policies
│       └── 003_seed_data.sql       # Seed data for categories, products, variants, delivery zones, admin
├── .env.example
├── .env
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

---

## 3. Quick Start & Running Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Comprehensive 15-Stage Verification Test Suite
```bash
npm test
```
All 15 verification stages run against server database constraints, variant stock deductions, concurrency oversell prevention, and security role checks:
- ✅ **TEST 1**: Admin logs in
- ✅ **TEST 2**: Admin creates a product
- ✅ **TEST 3**: Product appears in the shop
- ✅ **TEST 4**: Customer selects a product variant
- ✅ **TEST 5**: Customer adds product to cart
- ✅ **TEST 6**: Customer completes checkout
- ✅ **TEST 7**: Order is saved in the database
- ✅ **TEST 8**: Inventory is updated correctly (stock reduced)
- ✅ **TEST 9**: Admin sees the order
- ✅ **TEST 10**: Admin updates order status
- ✅ **TEST 11**: Customer can track the order
- ✅ **TEST 12**: Customer submits a cancellation request
- ✅ **TEST 13**: Admin reviews the cancellation & items restocked
- ✅ **TEST 14**: Unauthorized customers cannot access admin operations
- ✅ **TEST 15**: Test concurrent orders to ensure stock cannot be oversold

### 3. Start Development Servers
```bash
# Starts both Express API on port 5000 and Vite dev client on port 3000
npm run dev
```

### 4. Build and Run Production
```bash
# Builds Vite client into dist/client and compiles TypeScript
npm run build

# Starts production server (serves both API and SPA)
npm start
```
Access at: `http://localhost:5000`

---

## 4. Credentials & Access

### Default Admin Credentials
- **URL**: `http://localhost:5000/admin/login` (or `/admin`)
- **Email**: `admin@clevara.com`
- **Password**: `ClevaraAdmin2026!`

### Connecting Live Supabase Database
In `.env`:
```env
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>
```
Execute the SQL migration scripts in order within the Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_seed_data.sql`

### Connecting Live Nepal eSewa Credentials
In `.env`:
```env
ESEWA_MERCHANT_CODE=<your-live-merchant-code>
ESEWA_SECRET_KEY=<your-live-secret-key>
ESEWA_GATEWAY_URL=https://epay.esewa.com.np/api/epay/main/v2/form
ESEWA_VERIFY_URL=https://epay.esewa.com.np/api/epay/transaction/status
```

---

## 5. Summary of Customer & Administrative Features

- **Storefront & Catalog**:
  - Live variant selectors (scents, colors, sizes) updating pricing, SKU, and stock count.
  - Cart drawer & page with localStorage synchronization.
  - Zone-based dynamic delivery fee calculator for Nepal.
  - Coupon discount validator.
- **Order Tracking**:
  - Direct tracking via Order Number (`CLV-XXXXXX`) or Tracking Code (`NP-XXXXXX`).
  - Visual status progress bar (Order Placed → Confirmed → Processing → Dispatched → Out for Delivery → Delivered).
- **Admin Control Center**:
  - Real-time KPI cards: Total Revenue, Total Orders, Pending Deliveries, Warehouse Stock Valuation, Low-Stock Alerts.
  - Product & Variant Builder (create, edit, delete, toggle active/draft, add variants with separate stock and SKUs).
  - Category manager (Home Cleaning, Body Cleaning, Car Cleaning).
  - Inventory manager with movement audit log (order deductions, restocks, adjustments).
  - Order fulfillment controls (update status, inspect customer phone/address/messaging handles).
  - 50% Refund evaluation console with photo evidence inspection.
  - Cancellation review with automatic item restock.
  - Promotional event banners & coupon generator.
  - Delivery zones & shipping rates editor.
  - Website content manager for announcement bar and hero banner.
  - Customer complaint and inquiry ticket resolution.
