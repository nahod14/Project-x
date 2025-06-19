import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../models/User';

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to register user' });
    }
  }

  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to login' });
    }
  }

  static async logout(_req: Request, res: Response): Promise<Response> {
    try {
      // In a real application, you might want to invalidate the token
      // or add it to a blacklist
      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
  }

  static async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IUser;
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to get user information' });
    }
  }
}

// Named exports for backward compatibility
export const register = AuthController.register;
export const login = AuthController.login; 