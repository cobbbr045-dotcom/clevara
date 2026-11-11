import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/orders (Public checkout)
router.post('/', (req, res) => {
  const {
    customer_id,
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    city,
    delivery_zone_id,
    delivery_instructions,
    instagram_username,
    whatsapp_number,
    viber_number,
    payment_method,
    coupon_code,
    items
  } = req.body;

  // Validation
  if (!customer_name || !customer_email || !customer_phone || !delivery_address || !city || !delivery_zone_id) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required shipping details (full name, email, phone, city, address, delivery zone).'
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Your cart is empty. Add products before proceeding to checkout.'
    });
  }

  const result = db.createOrder({
    customer_id,
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    city,
    delivery_zone_id,
    delivery_instructions,
    instagram_username,
    whatsapp_number,
    viber_number,
    payment_method: payment_method === 'esewa' ? 'esewa' : 'cod',
    coupon_code,
    items
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
});

// GET /api/orders/track/:reference (Public order tracking)
router.get('/track/:reference', (req, res) => {
  const order = db.getOrderByIdOrNumber(req.params.reference);
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'No order found with provided Order Number or Tracking Code.'
    });
  }

  // Return customer-safe tracking view
  return res.json({
    success: true,
    order: {
      order_number: order.order_number,
      tracking_code: order.tracking_code,
      customer_name: order.customer_name,
      order_status: order.order_status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      subtotal: order.subtotal,
      delivery_fee: order.delivery_fee,
      discount_amount: order.discount_amount,
      total_amount: order.total_amount,
      city: order.city,
      delivery_address: order.delivery_address,
      delivery_zone: order.delivery_zone,
      items: order.items,
      created_at: order.created_at,
      updated_at: order.updated_at
    }
  });
});

// GET /api/orders (Admin only: list, search, filter)
router.get('/', requireAdmin, (req, res) => {
  const { status, search, customerEmail } = req.query;
  const orders = db.getOrders({
    status: status as string | undefined,
    search: search as string | undefined,
    customerEmail: customerEmail as string | undefined
  });
  return res.json({ success: true, orders, count: orders.length });
});

// GET /api/orders/:id (Admin view)
router.get('/:id', requireAdmin, (req, res) => {
  const order = db.getOrderByIdOrNumber(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }
  return res.json({ success: true, order });
});

// PATCH /api/orders/:id/status (Admin update status)
router.patch('/:id/status', requireAdmin, (req, res) => {
  const { status, payment_status, notes } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required.' });
  }

  const updated = db.updateOrderStatus(req.params.id, status, payment_status, notes);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  return res.json({ success: true, order: updated });
});

export default router;
