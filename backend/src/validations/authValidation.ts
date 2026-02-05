import { Request, Response, NextFunction } from 'express';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  // Check required fields
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username, email, and password'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Validate username length
  if (username.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Username must be at least 3 characters long'
    });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  next();
};

export const validateUpdateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = req.body;

  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide username or email to update'
    });
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
  }

  if (username && username.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Username must be at least 3 characters long'
    });
  }

  next();
};

export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password'
    });
  }

  next();
};
