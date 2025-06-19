import { Request, Response } from 'express';
import { TwoFactorService } from '../services/twoFactorService';
import { authenticator } from 'otplib';
import { IUser } from '../models/User';

export class TwoFactorController {
  static async setup(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IUser;
      const secret = await TwoFactorService.generateSecret(user);
      
      const otpauth = authenticator.keyuri(
        user.email,
        'Price Tracker',
        secret
      );

      return res.json({
        secret,
        otpauth,
        backupCodes: await TwoFactorService.getBackupCodes(user)
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to setup 2FA' });
    }
  }

  static async verify(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IUser;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }

      const isValid = await TwoFactorService.verifyToken(user, token);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid token' });
      }

      await TwoFactorService.enable2FA(user);
      return res.json({ message: '2FA enabled successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to verify 2FA' });
    }
  }

  static async verifyBackupCode(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IUser;
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ message: 'Backup code is required' });
      }

      const isValid = await TwoFactorService.verifyBackupCode(user, code);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid backup code' });
      }

      return res.json({ message: 'Backup code verified successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to verify backup code' });
    }
  }

  static async disable(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IUser;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }

      const isValid = await TwoFactorService.verifyToken(user, token);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid token' });
      }

      await TwoFactorService.disable2FA(user);
      return res.json({ message: '2FA disabled successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to disable 2FA' });
    }
  }

  static async getBackupCodes(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IUser;
      const backupCodes = await TwoFactorService.getBackupCodes(user);
      return res.json({ backupCodes });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to get backup codes' });
    }
  }
} 