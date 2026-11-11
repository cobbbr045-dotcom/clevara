import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/cancellations (Customer submits cancellation request - TEST 12)
router.post('/', (req, res) => {
  const { order_number, reason } = req.body;
  if (!order_number || !reason) {
    return res.status(400).json({ success: false, error: 'Order number and cancellation reason are required.' });
  }

  const result = db.requestCancellation(order_number, reason);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
});

// GET /api/cancellations (Admin only: view all cancellation requests)
router.get('/', requireAdmin, (req, res) => {
  const requests = db.getCancellationRequests();
  return res.json({ success: true, requests });
});

// PATCH /api/cancellations/:id/review (Admin only: review cancellation - TEST 13)
router.patch('/:id/review', requireAdmin, (req, res) => {
  const { action, admin_notes } = req.body;
  if (!action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, error: 'Action must be either "approve" or "reject".' });
  }

  const updated = db.reviewCancellation(req.params.id, action, admin_notes);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Cancellation request not found.' });
  }

  return res.json({ success: true, request: updated });
});

export default router;
