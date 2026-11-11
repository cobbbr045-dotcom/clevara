import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/reviews/product/:productId (Public approved reviews)
router.get('/product/:productId', (req, res) => {
  const reviews = db.getReviewsByProduct(req.params.productId);
  return res.json({ success: true, reviews });
});

// GET /api/reviews (Admin all reviews)
router.get('/', requireAdmin, (req, res) => {
  const reviews = db.getAllReviews();
  return res.json({ success: true, reviews });
});

// POST /api/reviews (Customer submits review)
router.post('/', (req, res) => {
  const { product_id, customer_name, rating, comment, customer_id, is_verified_purchase } = req.body;
  if (!product_id || !customer_name || !rating || !comment) {
    return res.status(400).json({ success: false, error: 'Product, customer name, rating, and review comment are required.' });
  }

  const review = db.createReview({
    product_id,
    customer_id,
    customer_name,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment,
    is_verified_purchase: !!is_verified_purchase
  });

  return res.status(201).json({ success: true, review });
});

// PATCH /api/reviews/:id/moderate (Admin approve or reject review)
router.patch('/:id/moderate', requireAdmin, (req, res) => {
  const { is_approved } = req.body;
  const updated = db.moderateReview(req.params.id, Boolean(is_approved));
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Review not found.' });
  }
  return res.json({ success: true, review: updated });
});

export default router;
