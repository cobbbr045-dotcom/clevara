import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Guard all admin routes
router.use(requireAdmin);

// GET /api/admin/overview
router.get('/overview', (req, res) => {
  const overview = db.getDashboardOverview();
  return res.json({ success: true, overview });
});

// GET /api/admin/customers
router.get('/customers', (req, res) => {
  const customers = db.getCustomers();
  return res.json({ success: true, customers });
});

// GET /api/admin/inventory-movements
router.get('/inventory-movements', (req, res) => {
  const movements = db.getInventoryMovements();
  return res.json({ success: true, movements });
});

export default router;
