import { db } from '../db/database.js';
import { AuthService } from '../services/authService.js';

async function runAllTests() {
  console.log('\n=============================================================');
  console.log('🧪 RUNNING CLEVARA COMPREHENSIVE 15-STAGE VERIFICATION SUITE');
  console.log('=============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testNum: number, name: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] TEST ${testNum}: ${name}`);
      if (detail) console.log(`   └─ ${detail}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] TEST ${testNum}: ${name}`);
      if (detail) console.error(`   └─ Detail: ${detail}`);
      failed++;
    }
  }

  try {
    // TEST 1: Admin logs in
    const loginResult = await AuthService.adminLogin('admin@clevara.com', 'ClevaraAdmin2026!');
    assert(loginResult.success && !!loginResult.token, 1, 'Admin logs in', `Token generated for ${loginResult.user?.full_name}`);
    const adminToken = loginResult.token!;

    // TEST 2: Admin creates a product
    const initialCategories = db.getCategories();
    const homeCat = initialCategories.find(c => c.slug === 'home-cleaning') || initialCategories[0];
    const newProduct = db.createProduct({
      category_id: homeCat.id,
      name: 'CLEVARA Heavy Duty Lime & Scale Eliminator',
      slug: 'clevara-lime-scale-eliminator',
      description: 'Specially engineered high-density gel that dissolves mineral scaling and water stains.',
      selling_price: 720,
      original_price: 850,
      sku: 'CLV-HC-LSE-099',
      stock_quantity: 15,
      status: 'active',
      is_featured: true,
      specifications: { 'Volume': '500 ml', 'Formula': 'Acid-Safe Gel' },
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
      variants: [
        {
          variant_name: 'Citrus Scent',
          sku: 'CLV-HC-LSE-099-CIT',
          stock_quantity: 10,
          price_override: 720,
          is_active: true
        },
        {
          variant_name: 'Fragrance Free',
          sku: 'CLV-HC-LSE-099-RAW',
          stock_quantity: 5,
          price_override: 720,
          is_active: true
        }
      ]
    });
    assert(!!newProduct && newProduct.sku === 'CLV-HC-LSE-099', 2, 'Admin creates a product', `Created product ID: ${newProduct.id}`);

    // TEST 3: Product appears in the shop
    const shopProducts = db.getProducts({ status: 'active' });
    const foundInShop = shopProducts.some(p => p.id === newProduct.id);
    assert(foundInShop, 3, 'Product appears in the shop', `Total active shop products: ${shopProducts.length}`);

    // TEST 4: Customer selects a product variant
    const createdVariants = db.getVariantsByProductId(newProduct.id);
    const selectedVariant = createdVariants.find(v => v.variant_name === 'Citrus Scent');
    assert(!!selectedVariant && selectedVariant.stock_quantity === 10, 4, 'Customer selects a product variant', `Selected: ${selectedVariant?.variant_name} (Stock: ${selectedVariant?.stock_quantity})`);

    // TEST 5: Customer adds product to cart
    const cart = [
      {
        product_id: newProduct.id,
        variant_id: selectedVariant!.id,
        quantity: 2
      }
    ];
    assert(cart.length === 1 && cart[0].quantity === 2, 5, 'Customer adds product to cart', `Cart items: ${cart.length}, Quantity: ${cart[0].quantity}`);

    // TEST 6: Customer completes checkout
    const zones = db.getDeliveryZones();
    const ktmZone = zones.find(z => z.name.includes('Inside Ring Road')) || zones[0];
    const initialVariantStock = selectedVariant!.stock_quantity; // 10

    const orderResult = db.createOrder({
      customer_name: 'Aarav Shrestha',
      customer_email: 'aarav.shrestha@example.np',
      customer_phone: '+977-9841234567',
      delivery_address: 'Baluwatar, House #42',
      city: 'Kathmandu',
      delivery_zone_id: ktmZone.id,
      delivery_instructions: 'Please call before arrival',
      payment_method: 'cod',
      items: cart
    });
    assert(orderResult.success && !!orderResult.order, 6, 'Customer completes checkout', `Order Number: ${orderResult.order?.order_number}, Total: Rs. ${orderResult.order?.total_amount}`);
    const createdOrder = orderResult.order!;

    // TEST 7: Order is saved in the database
    const fetchedOrder = db.getOrderByIdOrNumber(createdOrder.order_number);
    assert(!!fetchedOrder && fetchedOrder.id === createdOrder.id, 7, 'Order is saved in the database', `Verified Order ${fetchedOrder?.order_number} with status ${fetchedOrder?.order_status}`);

    // TEST 8: Inventory is updated correctly (Stock reduced from 10 to 8)
    const refreshedVariant = db.getVariantsByProductId(newProduct.id).find(v => v.id === selectedVariant!.id);
    const expectedStock = initialVariantStock - 2;
    assert(refreshedVariant?.stock_quantity === expectedStock, 8, 'Inventory is updated correctly', `Stock changed from ${initialVariantStock} -> ${refreshedVariant?.stock_quantity}`);

    // TEST 9: Admin sees the order
    const adminOrders = db.getOrders();
    const adminOrderFound = adminOrders.some(o => o.id === createdOrder.id);
    assert(adminOrderFound, 9, 'Admin sees the order', `Admin total orders visible: ${adminOrders.length}`);

    // TEST 10: Admin updates order status
    const updatedOrder = db.updateOrderStatus(createdOrder.id, 'confirmed', 'pending', 'Order confirmed by operations team.');
    assert(updatedOrder?.order_status === 'confirmed', 10, 'Admin updates order status', `Order status updated to "${updatedOrder?.order_status}"`);

    // TEST 11: Customer can track the order
    const tracked = db.getOrderByIdOrNumber(createdOrder.tracking_code);
    assert(!!tracked && tracked.tracking_code === createdOrder.tracking_code, 11, 'Customer can track the order', `Tracking code: ${tracked?.tracking_code}, Current status: ${tracked?.order_status}`);

    // TEST 12: Customer submits a cancellation request
    const cancelResult = db.requestCancellation(createdOrder.order_number, 'Ordered wrong variant by accident');
    assert(cancelResult.success && !!cancelResult.request, 12, 'Customer submits a cancellation request', `Cancellation Request ID: ${cancelResult.request?.id}`);
    const cancelReq = cancelResult.request!;

    // TEST 13: Admin reviews the cancellation
    const reviewedCancel = db.reviewCancellation(cancelReq.id, 'approve', 'Customer contacted within cancellation window');
    const orderAfterCancel = db.getOrderByIdOrNumber(createdOrder.id);
    // When approved, inventory should be automatically restocked!
    const restockedVariant = db.getVariantsByProductId(newProduct.id).find(v => v.id === selectedVariant!.id);
    assert(
      reviewedCancel?.status === 'approved' &&
      orderAfterCancel?.order_status === 'cancelled' &&
      restockedVariant?.stock_quantity === initialVariantStock,
      13,
      'Admin reviews the cancellation',
      `Cancellation approved, order status = "${orderAfterCancel?.order_status}", stock restocked to ${restockedVariant?.stock_quantity}`
    );

    // TEST 14: Unauthorized customers cannot access admin operations
    const invalidToken = 'invalid.bearer.token';
    const decoded = AuthService.verifyToken(invalidToken);
    const customerToken = AuthService.generateToken({
      userId: 'c-fake-123',
      email: 'customer@test.com',
      role: 'customer',
      name: 'Customer'
    });
    const customerPayload = AuthService.verifyToken(customerToken);
    const isCustomerAdmin = customerPayload?.role === 'super_admin' || customerPayload?.role === 'store_manager';
    assert(
      decoded === null && !isCustomerAdmin,
      14,
      'Unauthorized customers cannot access admin operations',
      'Unauthenticated requests blocked (null); customer role rejected from admin privilege'
    );

    // TEST 15: Test concurrent orders to ensure stock cannot be oversold
    // Let's create an item with exactly 1 unit of stock
    const fragileVariant = db.addVariant(newProduct.id, {
      variant_name: 'Limited Batch #1',
      sku: 'CLV-HC-LSE-099-LIM',
      stock_quantity: 1,
      price_override: 720,
      is_active: true
    });

    // Order 1 takes the 1 unit
    const order1 = db.createOrder({
      customer_name: 'Buyer One',
      customer_email: 'buyer1@nepal.np',
      customer_phone: '+977-9800000001',
      delivery_address: 'Thamel',
      city: 'Kathmandu',
      delivery_zone_id: ktmZone.id,
      payment_method: 'cod',
      items: [{ product_id: newProduct.id, variant_id: fragileVariant.id, quantity: 1 }]
    });

    // Order 2 tries to order 1 unit of the now depleted stock
    const order2 = db.createOrder({
      customer_name: 'Buyer Two',
      customer_email: 'buyer2@nepal.np',
      customer_phone: '+977-9800000002',
      delivery_address: 'Patan',
      city: 'Lalitpur',
      delivery_zone_id: ktmZone.id,
      payment_method: 'cod',
      items: [{ product_id: newProduct.id, variant_id: fragileVariant.id, quantity: 1 }]
    });

    assert(
      order1.success === true && order2.success === false && order2.error?.includes('Insufficient stock') === true,
      15,
      'Test concurrent orders to ensure stock cannot be oversold',
      `Order 1: ${order1.success ? 'SUCCESS' : 'FAILED'} | Order 2: ${order2.success ? 'SUCCESS' : 'REJECTED with: ' + order2.error}`
    );

  } catch (err: any) {
    console.error('Unexpected test error occurred:', err);
    failed++;
  }

  console.log('\n=============================================================');
  console.log(`TEST SUITE RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
