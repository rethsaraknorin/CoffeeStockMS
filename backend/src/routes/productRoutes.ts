import { Router } from 'express';
import { productController } from '../controllers/productController';
import { validateCreateProduct, validateUpdateProduct } from '../validations/productValidation';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// All product routes require authentication
router.use(authenticate);

router.get('/', productController.getAllProducts);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
router.post('/', validateCreateProduct, productController.createProduct);
router.put('/:id', validateUpdateProduct, productController.updateProduct);
router.delete('/:id', isAdmin, productController.deleteProduct);

export default router;
