import { Router } from 'express';
import { exportController } from '../controllers/exportController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Excel Exports
router.get('/excel/inventory', exportController.exportInventoryExcel);
router.get('/excel/low-stock', exportController.exportLowStockExcel);
router.get('/excel/stock-movements', exportController.exportStockMovementsExcel);

// PDF Exports
router.get('/pdf/inventory', exportController.exportInventoryPDF);

export default router;