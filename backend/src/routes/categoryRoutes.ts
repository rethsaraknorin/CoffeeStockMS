import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// All category routes require authentication
router.use(authenticate);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', isAdmin, categoryController.deleteCategory);

export default router;
