import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password, role } = req.body;

      const result = await authService.register({
        username,
        email,
        password,
        role
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  },

  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  },

  // Get current user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await authService.getProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to get profile'
      });
    }
  },

  // Logout (client-side handles token removal)
  logout: async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Logout successful. Please remove token from client.'
    });
  }
};