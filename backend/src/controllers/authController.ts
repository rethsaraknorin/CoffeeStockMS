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
  },

  // Update current user profile
  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { username, email } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const result = await authService.updateProfile(userId, { username, email });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  },

  // Change current user password
  changePassword: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to change password'
      });
    }
  }
};
