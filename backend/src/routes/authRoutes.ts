import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateRegister, validateLogin, validateUpdateProfile, validateChangePassword } from '../validations/authValidation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/approve', authController.approveByToken);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validateUpdateProfile, authController.updateProfile);
router.put('/password', authenticate, validateChangePassword, authController.changePassword);
router.post('/logout', authenticate, authController.logout);

export default router;
