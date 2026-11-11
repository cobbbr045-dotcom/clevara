import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/promotions (Public active, or all if admin)
router.get('/', (req, res) => {
  const all = req.query.all === 'true';
  const promotions = db.getPromotions(!all);
  return res.json({ success: true, promotions });
});

// POST /api/promotions/validate (Customer validates coupon at checkout)
router.post('/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code || subtotal == null) {
    return res.status(400).json({ success: false, error: 'Code and subtotal are required.' });
  }

  const result = db.validatePromotion(code, Number(subtotal));
  if (!result.valid) {
    return res.status(400).json(result);
  }

  return res.json(result);
});

// POST /api/promotions (Admin only: create promo)
router.post('/', requireAdmin, (req, res) => {
  const { code, title, description, discount_type, discount_value, min_order_amount, max_discount_amount, start_date, end_date, is_active, usage_limit } = req.body;

  if (!code || !title || !discount_type || discount_value == null || !start_date || !end_date) {
    return res.status(400).json({ success: false, error: 'Missing required promotion fields.' });
  }

  const promo = db.createPromotion({
    code,
    title,
    description: description || '',
    discount_type,
    discount_value: Number(discount_value),
    min_order_amount: Number(min_order_amount || 0),
    max_discount_amount: max_discount_amount ? Number(max_discount_amount) : undefined,
    start_date,
    end_date,
    is_active: is_active ?? true,
    usage_limit: Number(usage_limit || 0)
  });

  return res.status(201).json({ success: true, promotion: promo });
});

// PUT /api/promotions/:id (Admin only: update promo)
router.put('/:id', requireAdmin, (req, res) => {
  const updated = db.updatePromotion(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Promotion not found.' });
  }
  return res.json({ success: true, promotion: updated });
});

export default router;
