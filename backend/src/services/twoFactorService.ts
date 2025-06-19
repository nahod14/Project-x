import { authenticator } from 'otplib';
import crypto from 'crypto';
import TwoFactorAuth from '../models/TwoFactorAuth';
import { IUser } from '../models/User';

export class TwoFactorService {
  static async generateSecret(user: IUser): Promise<string> {
    const secret = authenticator.generateSecret();
    
    // Save or update the secret for the user
    await TwoFactorAuth.findOneAndUpdate(
      { userId: user._id },
      { 
        userId: user._id,
        secret,
        isEnabled: false,
        backupCodes: this.generateBackupCodes()
      },
      { upsert: true, new: true }
    );
    
    return secret;
  }

  static async verifyToken(user: IUser, token: string): Promise<boolean> {
    const twoFactorAuth = await TwoFactorAuth.findOne({ userId: user._id });
    if (!twoFactorAuth) {
      return false;
    }

    return authenticator.verify({
      token,
      secret: twoFactorAuth.secret
    });
  }

  static async enable2FA(user: IUser): Promise<void> {
    await TwoFactorAuth.findOneAndUpdate(
      { userId: user._id },
      { isEnabled: true }
    );
  }

  static async disable2FA(user: IUser): Promise<void> {
    await TwoFactorAuth.findOneAndUpdate(
      { userId: user._id },
      { isEnabled: false }
    );
  }

  static async verifyBackupCode(user: IUser, code: string): Promise<boolean> {
    const twoFactorAuth = await TwoFactorAuth.findOne({ userId: user._id });
    if (!twoFactorAuth) {
      return false;
    }

    const codeIndex = twoFactorAuth.backupCodes.indexOf(code);
    if (codeIndex === -1) {
      return false;
    }

    // Remove the used backup code
    twoFactorAuth.backupCodes.splice(codeIndex, 1);
    await twoFactorAuth.save();

    return true;
  }

  static async getBackupCodes(user: IUser): Promise<string[]> {
    const twoFactorAuth = await TwoFactorAuth.findOne({ userId: user._id });
    return twoFactorAuth?.backupCodes || [];
  }

  private static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }
} 