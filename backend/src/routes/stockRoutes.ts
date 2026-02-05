import { Router } from 'express';
import { stockController } from '../controllers/stockController';
import { validateStockMovement, validateStockAdjustment } from '../validations/stockValidation';
import { authenticate } from '../middleware/auth';

const router = Router();

// All stock routes require authentication
router.use(authenticate);

// Stock operations
router.post('/in', validateStockMovement, stockController.addStock);
router.post('/out', validateStockMovement, stockController.removeStock);
router.post('/adjust', validateStockAdjustment, stockController.adjustStock);

// Stock history and movements
router.get('/movements', stockController.getAllStockMovements);
router.get('/movements/:productId', stockController.getProductStockHistory);

// Stock summary/dashboard
router.get('/summary', stockController.getStockSummary);
router.post('/reorder-all', stockController.reorderAll);

export default router;
