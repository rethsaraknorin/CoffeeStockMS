import { Router } from 'express';
import { productController } from '../controllers/productController';
import { validateCreateProduct, validateUpdateProduct } from '../validations/productValidation';
import { authenticate, isAdmin, requireActiveUser } from '../middleware/auth';

const router = Router();

// All product routes require authentication
router.use(authenticate);

router.get('/', productController.getAllProducts);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
router.post('/', requireActiveUser, validateCreateProduct, productController.createProduct);
router.put('/:id', requireActiveUser, validateUpdateProduct, productController.updateProduct);
router.delete('/:id', requireActiveUser, isAdmin, productController.deleteProduct);

export default router;
