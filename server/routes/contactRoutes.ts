import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// POST /api/contact (Public customer submits inquiry or complaint)
router.post('/', (req, res) => {
  const { full_name, email, phone, subject, message, category } = req.body;
  if (!full_name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Full name, email, subject, and message are required.' });
  }

  const saved = db.createContactMessage({
    full_name,
    email,
    phone,
    subject,
    message,
    category: category || 'inquiry'
  });

  return res.status(201).json({ success: true, message: 'Your message has been received by CLEVARA support team.', ticket: saved });
});

// GET /api/contact (Admin reviews inquiries and complaints)
router.get('/', requireAdmin, (req, res) => {
  const messages = db.getContactMessages();
  return res.json({ success: true, messages });
});

// PATCH /api/contact/:id/status (Admin updates complaint status)
router.patch('/:id/status', requireAdmin, (req, res) => {
  const { status, admin_notes } = req.body;
  const updated = db.updateContactMessageStatus(req.params.id, status, admin_notes);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Ticket not found.' });
  }
  return res.json({ success: true, ticket: updated });
});

export default router;
