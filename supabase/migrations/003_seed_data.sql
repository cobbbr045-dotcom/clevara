-- ============================================================================
-- CLEVARA E-COMMERCE PLATFORM — SEED DATA MIGRATION 003
-- ============================================================================

-- 1. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, display_order)
VALUES
('c1000000-0000-0000-0000-000000000001', 'Home Cleaning', 'home-cleaning', 'Meticulously formulated household, kitchen, and bathroom essentials engineered for effortless cleanliness.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', 1),
('c2000000-0000-0000-0000-000000000002', 'Body Cleaning', 'body-cleaning', 'Pure, skin-friendly personal hygiene essentials and accessories crafted for everyday wellbeing.', 'https://images.unsplash.com/photo-1608248597359-009139268d87?auto=format&fit=crop&w=800&q=80', 2),
('c3000000-0000-0000-0000-000000000003', 'Car Cleaning', 'car-cleaning', 'Professional-grade vehicle exterior wash, interior detailing, and maintenance essentials.', 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80', 3)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED DELIVERY ZONES
INSERT INTO delivery_zones (id, name, description, estimated_delivery_time, fee, is_active)
VALUES
('d1000000-0000-0000-0000-000000000001', 'Kathmandu Valley (Inside Ring Road)', 'Standard door-to-door delivery inside Ring Road, Kathmandu', '1 - 2 Business Days', 100.00, true),
('d2000000-0000-0000-0000-000000000002', 'Kathmandu Valley (Outside Ring Road / Lalitpur / Bhaktapur)', 'Doorstep delivery for suburban areas, Lalitpur & Bhaktapur', '1 - 2 Business Days', 150.00, true),
('d3000000-0000-0000-0000-000000000003', 'Major Regional Hubs (Pokhara, Chitwan, Biratnagar, Butwal)', 'Express courier delivery to major municipal areas outside Kathmandu Valley', '2 - 4 Business Days', 200.00, true),
('d4000000-0000-0000-0000-000000000004', 'Rest of Nepal (Nationwide Courier)', 'Comprehensive provincial delivery across reachable road & courier networks', '3 - 6 Business Days', 250.00, true)
ON CONFLICT DO NOTHING;

-- 3. SEED PRODUCTS
INSERT INTO products (id, category_id, name, slug, description, selling_price, original_price, sku, stock_quantity, status, is_featured, specifications, images)
VALUES
(
    'p1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'CLEVARA Multi-Surface Botanical Surface Spray',
    'clevara-multi-surface-botanical-spray',
    'High-efficiency, plant-derived multi-surface cleaning spray designed to dissolve grime, grease, and dust without harsh chemical fumes. Leaves surfaces streak-free and subtly fragrant.',
    650.00,
    750.00,
    'CLV-HC-MS-001',
    45,
    'active',
    true,
    '{"Volume": "500 ml", "Form": "Liquid Spray", "Surfaces": "Countertops, tiles, sealed marble, porcelain, wood", "Origin": "Formulated for CLEVARA", "Packaging": "Recyclable PET bottle with adjustable mist nozzle"}'::jsonb,
    '["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80"]'::jsonb
),
(
    'p1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'CLEVARA Kitchen Heavy-Duty Degreaser Concentrate',
    'clevara-kitchen-degreaser-concentrate',
    'Formulated to penetrate baked-on stove grease, exhaust filter buildup, and kitchen tile residue. Dilutable concentrate provides up to 5 spray bottles of heavy-duty cleaning solution.',
    890.00,
    990.00,
    'CLV-HC-DG-002',
    30,
    'active',
    true,
    '{"Volume": "1000 ml (Concentrated)", "Application": "Stovetops, chimneys, oven trays, fryer surroundings", "Dilution Ratio": "1:4 for standard cleaning, neat for heavy grease", "Safety": "Non-corrosive on stainless steel"}'::jsonb,
    '["https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=80"]'::jsonb
),
(
    'p1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000001',
    'CLEVARA Ultra-Dense Microfiber Cleaning Towels (Pack of 4)',
    'clevara-ultra-dense-microfiber-pack-of-4',
    'Lint-free 400 GSM dual-woven microfiber cloths designed for scratch-free cleaning, dusting, and polishing on delicate finishes and electronics.',
    550.00,
    650.00,
    'CLV-HC-MF-003',
    60,
    'active',
    false,
    '{"GSM": "400", "Dimensions": "40 cm x 40 cm", "Pack Quantity": "4 Towels", "Material": "80% Polyester, 20% Polyamide", "Care": "Machine washable up to 300 cycles"}'::jsonb,
    '["https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80"]'::jsonb
),
(
    'p2000000-0000-0000-0000-000000000001',
    'c2000000-0000-0000-0000-000000000002',
    'CLEVARA Clarifying Botanical Hand & Body Wash',
    'clevara-clarifying-botanical-hand-body-wash',
    'pH-balanced cleansing wash enriched with soothing plant glycerine and mild surfactants. Cleanses deeply while preserving the skin barrier without tightness.',
    750.00,
    850.00,
    'CLV-BC-BW-001',
    40,
    'active',
    true,
    '{"Volume": "400 ml", "pH Level": "5.5 balanced", "Skin Type": "Suitable for all skin types, including sensitive", "Dispenser": "Lockable heavy-duty amber pump", "Formulation": "Sulfate-conscious, paraben-free"}'::jsonb,
    '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"]'::jsonb
),
(
    'p2000000-0000-0000-0000-000000000002',
    'c2000000-0000-0000-0000-000000000002',
    'CLEVARA Dual-Texture Exfoliating Loofah & Sisal Pad',
    'clevara-dual-texture-exfoliating-loofah-pad',
    'Handcrafted natural fiber cleansing accessory with an exfoliating sisal side for deep pore stimulation and a soft terry-cloth backing for gentle daily use.',
    380.00,
    450.00,
    'CLV-BC-LF-002',
    50,
    'active',
    false,
    '{"Materials": "100% Natural Sisal and Organic Cotton Terry", "Dimensions": "15 cm x 10 cm", "Features": "Elastic hand strap for comfortable grip", "Durability": "Resistant to fraying"}'::jsonb,
    '["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"]'::jsonb
),
(
    'p3000000-0000-0000-0000-000000000001',
    'c3000000-0000-0000-0000-000000000003',
    'CLEVARA Ceramic-Infused High-Foam Vehicle Shampoo',
    'clevara-ceramic-infused-high-foam-vehicle-shampoo',
    'High-lubricity pH-neutral auto shampoo designed for both bucket wash and foam cannon. Safely lifts abrasive road dust and mud without stripping waxes or ceramic coatings.',
    980.00,
    1150.00,
    'CLV-CC-CS-001',
    35,
    'active',
    true,
    '{"Volume": "1000 ml", "pH Level": "7.0 (Neutral)", "Concentration": "1:250 bucket wash / 1:9 foam lance", "Coating Safe": "Safe for clear coats, vinyl wraps, and PPF", "Lubrication": "High slip polymers to prevent swirl marks"}'::jsonb,
    '["https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80"]'::jsonb
),
(
    'p3000000-0000-0000-0000-000000000002',
    'c3000000-0000-0000-0000-000000000003',
    'CLEVARA Satin Finish Car Interior Detailer & UV Shield',
    'clevara-satin-finish-car-interior-detailer',
    'Non-greasy interior dressing for vehicle dashboards, consoles, steering wheels, and door trims. Repels dust while offering UV inhibitors against sun fading in Nepal conditions.',
    820.00,
    950.00,
    'CLV-CC-ID-002',
    28,
    'active',
    true,
    '{"Volume": "500 ml", "Finish": "Original OEM Satin / Matte (Zero oily shine)", "Surfaces": "Vinyl, plastic, treated leather, rubber, touchscreens", "UV Protection": "Active UV blocking agents"}'::jsonb,
    '["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"]'::jsonb
),
(
    'p3000000-0000-0000-0000-000000000003',
    'c3000000-0000-0000-0000-000000000003',
    'CLEVARA 1200 GSM Twisted-Loop Vehicle Drying Towel',
    'clevara-1200-gsm-vehicle-drying-towel',
    'Enormous 60x90cm luxury drying towel with Korean twisted-loop fibers that absorb up to 2.5 liters of water in a single continuous glide across vehicle body panels.',
    1250.00,
    1450.00,
    'CLV-CC-DT-003',
    20,
    'active',
    false,
    '{"GSM": "1200 GSM Heavyweight", "Dimensions": "60 cm x 90 cm", "Weave": "Twisted loop microfiber with hidden silk edge", "Water Capacity": "Up to 2.5 Litres"}'::jsonb,
    '["https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED PRODUCT VARIANTS
INSERT INTO product_variants (id, product_id, variant_name, sku, stock_quantity, price_override, image_url, is_active)
VALUES
-- Variants for Multi-Surface Spray
('v1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'Eucalyptus Mist', 'CLV-HC-MS-001-EUC', 25, 650.00, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', true),
('v1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'Citrus Blossom', 'CLV-HC-MS-001-CIT', 20, 650.00, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80', true),

-- Variants for Microfiber Towels Pack of 4
('v1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000003', 'Slate Grey', 'CLV-HC-MF-003-GRY', 35, 550.00, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80', true),
('v1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000003', 'Arctic Blue', 'CLV-HC-MF-003-BLU', 25, 550.00, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80', true),

-- Variants for Clarifying Body Wash
('v2000000-0000-0000-0000-000000000001', 'p2000000-0000-0000-0000-000000000001', 'Bergamot & Cedar', 'CLV-BC-BW-001-BER', 22, 750.00, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', true),
('v2000000-0000-0000-0000-000000000002', 'p2000000-0000-0000-0000-000000000001', 'Lavender Herbal', 'CLV-BC-BW-001-LAV', 18, 750.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80', true),

-- Variants for Vehicle Drying Towel
('v3000000-0000-0000-0000-000000000001', 'p3000000-0000-0000-0000-000000000003', 'Stealth Graphite (60x90cm)', 'CLV-CC-DT-003-GRP', 12, 1250.00, 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80', true),
('v3000000-0000-0000-0000-000000000002', 'p3000000-0000-0000-0000-000000000003', 'Royal Cobalt (60x90cm)', 'CLV-CC-DT-003-CBL', 8, 1250.00, 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (sku) DO NOTHING;

-- 5. SEED INVENTORY ENTRIES
INSERT INTO inventory (product_id, variant_id, current_stock, reserved_stock, low_stock_threshold)
VALUES
('p1000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001', 25, 0, 5),
('p1000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000002', 20, 0, 5),
('p1000000-0000-0000-0000-000000000002', NULL, 30, 0, 5),
('p1000000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000003', 35, 0, 8),
('p1000000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000004', 25, 0, 8),
('p2000000-0000-0000-0000-000000000001', 'v2000000-0000-0000-0000-000000000001', 22, 0, 5),
('p2000000-0000-0000-0000-000000000001', 'v2000000-0000-0000-0000-000000000002', 18, 0, 5),
('p2000000-0000-0000-0000-000000000002', NULL, 50, 0, 10),
('p3000000-0000-0000-0000-000000000001', NULL, 35, 0, 6),
('p3000000-0000-0000-0000-000000000002', NULL, 28, 0, 5),
('p3000000-0000-0000-0000-000000000003', 'v3000000-0000-0000-0000-000000000001', 12, 0, 4),
('p3000000-0000-0000-0000-000000000003', 'v3000000-0000-0000-0000-000000000002', 8, 0, 4)
ON CONFLICT DO NOTHING;

-- 6. SEED PROMOTIONS
INSERT INTO promotions (id, code, title, description, discount_type, discount_value, min_order_amount, start_date, end_date, is_active, usage_limit, times_used)
VALUES
('pr100000-0000-0000-0000-000000000001', 'CLEVARA10', 'Welcome to CLEVARA Nepal', 'Get 10% off your initial order above Rs. 1,000 across all cleaning categories.', 'percentage', 10.00, 1000.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '120 days', true, 500, 12),
('pr200000-0000-0000-0000-000000000002', 'CLEANHOME', 'Home Care Seasonal Discount', 'Flat Rs. 150 off on essential home care collections.', 'fixed', 150.00, 1500.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days', true, 200, 4)
ON CONFLICT (code) DO NOTHING;

-- 7. SEED EVENTS
INSERT INTO events (id, title, description, banner_url, discount_percent, start_date, end_date, is_active, is_limited_time)
VALUES
('ev100000-0000-0000-0000-000000000001', 'CLEVARA Spring Clean Festival', 'Exclusive seasonal introductory discount on our highest rated multi-surface and auto maintenance essentials.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80', 15, NOW() - INTERVAL '2 days', NOW() + INTERVAL '20 days', true, true)
ON CONFLICT DO NOTHING;

-- 8. SEED INITIAL ADMIN USER
-- Password is 'ClevaraAdmin2026!'
-- bcrypt hash of 'ClevaraAdmin2026!': $2a$10$wK1Gvj8rE02gM4p3mZgX5O2Kj5/6Jb7P5q.z3Mh2oF1L3c1Hq2m9u
INSERT INTO admin_profiles (id, email, full_name, role, password_hash)
VALUES
('a1000000-0000-0000-0000-000000000001', 'admin@clevara.com', 'CLEVARA Head of Operations', 'super_admin', '$2a$10$Q7wE3zR6kR5F4W9L3x1Z8OnL7tHq5sA3dF9gG1hJ2kL3mN4oP5q6.')
ON CONFLICT (email) DO NOTHING;

-- 9. SEED WEBSITE CONTENT
INSERT INTO website_content (section_key, title, subtitle, content_json, is_active)
VALUES
(
    'announcement_bar',
    'Free delivery across Kathmandu Valley on orders over Rs. 2,000 | Authentic CLEVARA Formulations',
    'Nationwide delivery available across Nepal',
    '{"badge": "OFFICIAL STORE", "link": "/shop"}'::jsonb,
    true
),
(
    'homepage_hero',
    'Purity in Formulation. Precision in Cleanliness.',
    'Engineered consumer care essentials for your home, your body, and your vehicle. Delivered directly to your doorstep in Nepal.',
    '{"cta_primary": {"text": "Explore Collection", "url": "/shop"}, "cta_secondary": {"text": "Our Standards", "url": "/about"}, "banner_image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"}'::jsonb,
    true
),
(
    'why_choose_clevara',
    'Why Discerning Households Trust CLEVARA',
    'We don’t white-label generic products. We engineer high-performance formulas tailored for Nepali living conditions.',
    '{"pillars": [{"title": "Strict Quality Control", "desc": "Every batch is inspected for consistency, pH stability, and performance safety."}, {"title": "Transparent Deliveries", "desc": "Fixed, fair delivery pricing throughout Nepal with zero surprise markups."}, {"title": "Customer-First Protections", "desc": "Clear return workflows and a 50% refund policy on verified claims."}]}'::jsonb,
    true
)
ON CONFLICT (section_key) DO UPDATE SET updated_at = NOW();
