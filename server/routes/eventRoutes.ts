import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/events (Public active events, or all for admin)
router.get('/', (req, res) => {
  const all = req.query.all === 'true';
  const events = db.getEvents(!all);
  return res.json({ success: true, events });
});

// POST /api/events (Admin only: create event)
router.post('/', requireAdmin, (req, res) => {
  const { title, description, banner_url, discount_percent, start_date, end_date, is_active, is_limited_time } = req.body;
  if (!title || discount_percent == null || !start_date || !end_date) {
    return res.status(400).json({ success: false, error: 'Title, discount percent, start date, and end date are required.' });
  }

  const event = db.createEvent({
    title,
    description: description || '',
    banner_url: banner_url || '',
    discount_percent: Number(discount_percent),
    start_date,
    end_date,
    is_active: is_active ?? true,
    is_limited_time: !!is_limited_time
  });

  return res.status(201).json({ success: true, event });
});

// PUT /api/events/:id (Admin only: update event)
router.put('/:id', requireAdmin, (req, res) => {
  const updated = db.updateEvent(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Event not found.' });
  }
  return res.json({ success: true, event: updated });
});

// DELETE /api/events/:id (Admin only: delete event)
router.delete('/:id', requireAdmin, (req, res) => {
  const ok = db.deleteEvent(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Event not found.' });
  }
  return res.json({ success: true, message: 'Event deleted successfully.' });
});

export default router;
