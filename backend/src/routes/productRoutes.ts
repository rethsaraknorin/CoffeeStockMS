import { Router } from 'express';
import { productController } from '../controllers/productController';
import { validateCreateProduct, validateUpdateProduct } from '../validations/productValidation';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// Public routes (or protected - your choice)
router.get('/', productController.getAllProducts);
router.get('/low-stock', authenticate, productController.getLowStockProducts);
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
router.post('/', authenticate, validateCreateProduct, productController.createProduct);
router.put('/:id', authenticate, validateUpdateProduct, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

export default router;