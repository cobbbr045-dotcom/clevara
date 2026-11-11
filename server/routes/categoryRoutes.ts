import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/categories
router.get('/', (req, res) => {
  const categories = db.getCategories();
  return res.json({ success: true, categories });
});

// GET /api/categories/:slug
router.get('/:slug', (req, res) => {
  const category = db.getCategoryBySlug(req.params.slug);
  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }
  return res.json({ success: true, category });
});

// POST /api/categories (Admin only)
router.post('/', requireAdmin, (req, res) => {
  const { name, slug, description, image_url, display_order } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ success: false, error: 'Category name and slug are required.' });
  }

  const created = db.createCategory({
    name,
    slug,
    description: description || '',
    image_url: image_url || '',
    display_order: display_order ? Number(display_order) : 0
  });

  return res.status(201).json({ success: true, category: created });
});

// PUT /api/categories/:id (Admin only)
router.put('/:id', requireAdmin, (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }
  return res.json({ success: true, category: updated });
});

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  const ok = db.deleteCategory(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }
  return res.json({ success: true, message: 'Category deleted successfully.' });
});

export default router;
