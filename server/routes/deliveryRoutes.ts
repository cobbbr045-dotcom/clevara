import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/delivery-zones (Public: active only by default)
router.get('/', (req, res) => {
  const all = req.query.all === 'true';
  const zones = db.getDeliveryZones(!all);
  return res.json({ success: true, zones });
});

// POST /api/delivery-zones (Admin only)
router.post('/', requireAdmin, (req, res) => {
  const { name, description, estimated_delivery_time, fee, is_active } = req.body;
  if (!name || fee == null || !estimated_delivery_time) {
    return res.status(400).json({ success: false, error: 'Name, fee, and estimated delivery time are required.' });
  }

  const zone = db.createDeliveryZone({
    name,
    description: description || '',
    estimated_delivery_time,
    fee: Number(fee),
    is_active: is_active ?? true
  });

  return res.status(201).json({ success: true, zone });
});

// PUT /api/delivery-zones/:id (Admin only)
router.put('/:id', requireAdmin, (req, res) => {
  const updated = db.updateDeliveryZone(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Delivery zone not found.' });
  }
  return res.json({ success: true, zone: updated });
});

// DELETE /api/delivery-zones/:id (Admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  const ok = db.deleteDeliveryZone(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Delivery zone not found.' });
  }
  return res.json({ success: true, message: 'Delivery zone deleted successfully.' });
});

export default router;
