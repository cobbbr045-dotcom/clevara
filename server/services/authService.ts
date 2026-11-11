import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'clevara_nepal_jwt_secure_key_prod_2026_x89a';

export interface UserTokenPayload {
  userId: string;
  email: string;
  role: 'super_admin' | 'store_manager' | 'support_agent' | 'customer';
  name: string;
}

export class AuthService {
  public static generateToken(payload: UserTokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  public static verifyToken(token: string): UserTokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
    } catch {
      return null;
    }
  }

  public static async adminLogin(email: string, passwordPlain: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
    const admin = db.getAdminByEmail(email);
    if (!admin) {
      return { success: false, error: 'Invalid administrator credentials.' };
    }

    const match = await bcrypt.compare(passwordPlain, admin.password_hash);
    if (!match) {
      return { success: false, error: 'Invalid administrator credentials.' };
    }

    const token = this.generateToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.full_name
    });

    return {
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    };
  }
}
