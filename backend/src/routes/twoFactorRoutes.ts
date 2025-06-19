import { Router } from 'express';
import { TwoFactorController } from '../controllers/twoFactorController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protect all routes
router.use(authenticateToken);

// Setup 2FA
router.post('/setup', TwoFactorController.setup);

// Verify 2FA token
router.post('/verify', TwoFactorController.verify);

// Verify backup code
router.post('/verify-backup', TwoFactorController.verifyBackupCode);

// Disable 2FA
router.post('/disable', TwoFactorController.disable);

// Get backup codes
router.get('/backup-codes', TwoFactorController.getBackupCodes);

export default router; 