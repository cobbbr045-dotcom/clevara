import { Router } from 'express';
import { AuthService } from '../services/authService.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const result = await AuthService.adminLogin(email, password);
  if (!result.success) {
    return res.status(401).json(result);
  }

  return res.json(result);
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  return res.json({ success: true, user: req.user });
});

export default router;
