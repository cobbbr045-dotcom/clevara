import { Request, Response, NextFunction } from 'express';
import { AuthService, UserTokenPayload } from '../services/authService.js';

export interface AuthenticatedRequest extends Request {
  user?: UserTokenPayload;
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication token required.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = AuthService.verifyToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session token.' });
  }

  req.user = payload;
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (!req.user || !['super_admin', 'store_manager'].includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden. Administrator authorization required.' });
    }
    next();
  });
};
