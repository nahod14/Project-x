import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Auth rate limiter (more restrictive)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
    });
  },
});

// API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many API requests from this IP, please try again later.',
  },
  handler: (_req, res) => {
    res.status(429).json({
      error: 'Too many API requests from this IP, please try again later.',
    });
  },
});

// Rate limiter for password reset requests
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: 'Too many password reset attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many password reset attempts, please try again after an hour'
    });
  }
});

// Rate limiter for email verification requests
export const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: 'Too many email verification attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many email verification attempts, please try again after an hour'
    });
  }
}); 