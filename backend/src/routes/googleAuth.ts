import express from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const router = express.Router();

// Check if Google OAuth is configured
const isGoogleOAuthConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// Google OAuth login
router.get('/google', (req, res, next) => {
  if (!isGoogleOAuthConfigured) {
    return res.status(400).json({ 
      error: 'Google OAuth not configured',
      message: 'Google OAuth is not set up on this server. Please contact the administrator.'
    });
  }
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  if (!isGoogleOAuthConfigured) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_not_configured`);
  }
  
  passport.authenticate('google', { session: false })(req, res, () => {
    try {
      const user = req.user as IUser;
      
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          name: user.name 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
    }
  });
});

export default router; 