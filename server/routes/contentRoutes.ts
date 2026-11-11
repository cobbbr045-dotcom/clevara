import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/content (Public: get all active website content)
router.get('/', (req, res) => {
  const content = db.getWebsiteContent();
  return res.json({ success: true, content });
});

// GET /api/content/:key (Public: get single section by key)
router.get('/:key', (req, res) => {
  const content = db.getWebsiteContent(req.params.key);
  if (!content) {
    return res.status(404).json({ success: false, error: 'Content section not found.' });
  }
  return res.json({ success: true, content });
});

// PUT /api/content/:key (Admin only: update section)
router.put('/:key', requireAdmin, (req, res) => {
  const updated = db.updateWebsiteContent(req.params.key, req.body);
  return res.json({ success: true, content: updated });
});

export default router;
