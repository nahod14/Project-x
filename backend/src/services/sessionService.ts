import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export class SessionService {
  static generateToken(user: IUser): string {
    return jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async validateUser(userId: string): Promise<IUser | null> {
    try {
      const User = (await import('../models/User')).default;
      return await User.findById(userId);
    } catch (error) {
      return null;
    }
  }
} 