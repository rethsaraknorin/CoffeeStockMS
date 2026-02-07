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
  ,
  // Approve user via token (email link)
  approveByToken: async (req: Request, res: Response) => {
    try {
      const token = req.query.token as string | undefined;
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Approval token is required'
        });
      }

      const user = await authService.approveByToken(token);

      res.status(200).json({
        success: true,
        message: 'User approved successfully',
        data: user
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to approve user'
      });
    }
  }
  ,
  googleAuth: async (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      return res.status(500).json({
        success: false,
        message: 'Google OAuth is not configured'
      });
    }

    const scope = encodeURIComponent('openid email profile');
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent`;

    return res.redirect(authUrl);
  },

  googleCallback: async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string | undefined;
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Google OAuth code is missing'
        });
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const redirectUri = process.env.GOOGLE_REDIRECT_URI;
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

      if (!clientId || !clientSecret || !redirectUri) {
        return res.status(500).json({
          success: false,
          message: 'Google OAuth is not configured'
        });
      }

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        return res.status(400).json({
          success: false,
          message: `Google token exchange failed: ${errText}`
        });
      }

      const tokenData = (await tokenResponse.json()) as { access_token?: string };
      const accessToken = tokenData.access_token;
      if (!accessToken) {
        return res.status(400).json({
          success: false,
          message: 'Google token response missing access_token'
        });
      }

      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!profileResponse.ok) {
        return res.status(400).json({
          success: false,
          message: 'Failed to fetch Google profile'
        });
      }

      const profile = (await profileResponse.json()) as { email?: string; name?: string };
      if (!profile.email) {
        return res.status(400).json({
          success: false,
          message: 'Google profile missing email'
        });
      }
      const result = await authService.loginWithGoogle({
        email: profile.email,
        name: profile.name
      });

      const redirectTo = `${clientUrl}/callback?token=${encodeURIComponent(result.token)}`;
      return res.redirect(redirectTo);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Google authentication failed'
      });
    }
  }
};
