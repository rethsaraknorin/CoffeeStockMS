import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateRegister, validateLogin } from '../validations/authValidation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

export default router;