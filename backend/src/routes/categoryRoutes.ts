import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes
router.post('/', authenticate, categoryController.createCategory);
router.put('/:id', authenticate, categoryController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

export default router;