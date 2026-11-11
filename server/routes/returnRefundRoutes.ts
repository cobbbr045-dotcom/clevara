import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/returns (Customer submits return request with photo URLs)
router.post('/returns', (req, res) => {
  const { order_number, reason, photo_urls } = req.body;
  if (!order_number || !reason) {
    return res.status(400).json({ success: false, error: 'Order number and reason are required.' });
  }

  const result = db.requestReturn(order_number, reason, photo_urls || []);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
});

// GET /api/returns (Admin view return requests)
router.get('/returns', requireAdmin, (req, res) => {
  const requests = db.getReturnRequests();
  return res.json({ success: true, requests });
});

// GET /api/refunds (Admin view refund evaluations & requests)
router.get('/refunds', requireAdmin, (req, res) => {
  const requests = db.getRefundRequests();
  return res.json({ success: true, requests });
});

// PATCH /api/refunds/:id/review (Admin reviews and manages 50% refund)
router.patch('/refunds/:id/review', requireAdmin, (req, res) => {
  const { status, approved_amount, admin_notes } = req.body;
  if (!status || !['approved', 'processed', 'completed', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Status must be one of: approved, processed, completed, rejected.'
    });
  }

  const updated = db.reviewRefund(
    req.params.id,
    status,
    approved_amount != null ? Number(approved_amount) : undefined,
    admin_notes
  );

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Refund request not found.' });
  }

  return res.json({ success: true, request: updated });
});

export default router;
