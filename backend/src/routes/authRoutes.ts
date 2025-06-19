import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Register
router.post('/register', registerValidation, AuthController.register);

// Login
router.post('/login', loginValidation, AuthController.login);

// Logout
router.post('/logout', AuthController.logout);

// Get current user (protected route)
router.get('/me', authenticateToken, AuthController.getCurrentUser);

export default router; 