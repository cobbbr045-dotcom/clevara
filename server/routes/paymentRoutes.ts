import { Router } from 'express';
import { db } from '../db/database.js';
import { EsewaService } from '../services/esewaService.js';

const router = Router();

// POST /api/payments/esewa/initiate
router.post('/esewa/initiate', (req, res) => {
  const { order_id, client_success_url, client_failure_url } = req.body;
  if (!order_id) {
    return res.status(400).json({ success: false, error: 'Order ID is required.' });
  }

  const order = db.getOrderByIdOrNumber(order_id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  const paymentRequest = EsewaService.createPaymentRequest({
    amount: order.subtotal - order.discount_amount,
    deliveryFee: order.delivery_fee,
    totalAmount: order.total_amount,
    orderNumber: order.order_number,
    clientSuccessUrl: client_success_url || 'http://localhost:3000/order-confirmation?status=success',
    clientFailureUrl: client_failure_url || 'http://localhost:3000/checkout?payment=failed'
  });

  return res.json({ success: true, payment: paymentRequest });
});

// POST /api/payments/esewa/verify
router.post('/esewa/verify', (req, res) => {
  const { encoded_data, order_number } = req.body;
  if (!encoded_data) {
    return res.status(400).json({ success: false, error: 'Payment payload is required.' });
  }

  const verification = EsewaService.verifyCallbackSignature(encoded_data);
  if (!verification.verified) {
    return res.status(400).json({
      success: false,
      error: 'Cryptographic signature verification failed. Untrusted payment data.'
    });
  }

  const order = db.getOrderByIdOrNumber(order_number || verification.data?.transaction_uuid?.split('-')[0]);
  if (order) {
    db.updateOrderStatus(order.id, 'confirmed', 'paid', `eSewa Transaction Ref: ${verification.data?.transaction_code || verification.data?.transaction_uuid}`);
  }

  return res.json({ success: true, verified: true, data: verification.data });
});

export default router;
