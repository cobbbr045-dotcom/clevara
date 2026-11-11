-- ============================================================================
-- CLEVARA E-COMMERCE PLATFORM — ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

-- 1. CATEGORIES: Public read, Admin write
CREATE POLICY "Public categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- 2. PRODUCTS: Public can only view active products; Admins view all
CREATE POLICY "Active products viewable by everyone" ON products
    FOR SELECT USING (status = 'active');

-- 3. PRODUCT VARIANTS: Active variants viewable by everyone
CREATE POLICY "Active variants viewable by everyone" ON product_variants
    FOR SELECT USING (is_active = true);

-- 4. DELIVERY ZONES: Active zones viewable by everyone
CREATE POLICY "Active delivery zones viewable by everyone" ON delivery_zones
    FOR SELECT USING (is_active = true);

-- 5. REVIEWS: Approved reviews viewable by everyone
CREATE POLICY "Approved reviews viewable by everyone" ON reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Customers can submit reviews" ON reviews
    FOR INSERT WITH CHECK (true);

-- 6. PROMOTIONS & EVENTS: Public read active promotions and events
CREATE POLICY "Active promotions viewable by everyone" ON promotions
    FOR SELECT USING (is_active = true AND NOW() BETWEEN start_date AND end_date);

CREATE POLICY "Active events viewable by everyone" ON events
    FOR SELECT USING (is_active = true);

-- 7. ORDERS: Customers view their own orders via authenticated user_id or tracking
CREATE POLICY "Customers view own orders" ON orders
    FOR SELECT USING (
        (auth.uid() IS NOT NULL AND customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
        OR (auth.role() = 'service_role')
    );

CREATE POLICY "Order creation allowed during checkout" ON orders
    FOR INSERT WITH CHECK (true);

-- 8. ORDER ITEMS: Viewable if corresponding order is viewable
CREATE POLICY "Order items viewable with order" ON order_items
    FOR SELECT USING (
        order_id IN (SELECT id FROM orders WHERE 
            (auth.uid() IS NOT NULL AND customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
            OR (auth.role() = 'service_role')
        )
    );

CREATE POLICY "Order items insertable during checkout" ON order_items
    FOR INSERT WITH CHECK (true);

-- 9. WEBSITE CONTENT: Public read active content
CREATE POLICY "Active content viewable by everyone" ON website_content
    FOR SELECT USING (is_active = true);

-- 10. CONTACT MESSAGES: Public can insert inquiries
CREATE POLICY "Public can submit contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- 11. CANCELLATION & RETURN REQUESTS: Customers can submit requests for their orders
CREATE POLICY "Customers can request cancellation" ON cancellation_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers can request return" ON return_requests
    FOR INSERT WITH CHECK (true);

-- SERVICE ROLE BYPASS: Service role / Admin endpoints have full access to all tables
CREATE POLICY "Service role full access categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access variants" ON product_variants FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access inventory" ON inventory FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access inventory_movements" ON inventory_movements FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access customers" ON customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access admin_profiles" ON admin_profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access delivery_zones" ON delivery_zones FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access order_items" ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access payments" ON payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access promotions" ON promotions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access events" ON events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access cancellation_requests" ON cancellation_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access return_requests" ON return_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access refund_requests" ON refund_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access reviews" ON reviews FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access contact_messages" ON contact_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access website_content" ON website_content FOR ALL USING (auth.role() = 'service_role');
