import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticate, isAdmin, requireActiveUser } from '../middleware/auth';

const router = Router();

// All category routes require authentication
router.use(authenticate);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes
router.post('/', requireActiveUser, categoryController.createCategory);
router.put('/:id', requireActiveUser, categoryController.updateCategory);
router.delete('/:id', requireActiveUser, isAdmin, categoryController.deleteCategory);

export default router;
