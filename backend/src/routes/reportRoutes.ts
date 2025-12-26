import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All report routes require authentication
router.use(authenticate);

// Dashboard & Overview
router.get('/dashboard', reportController.getDashboardOverview);

// Detailed Reports
router.get('/stock-movements', reportController.getStockMovementReport);
router.get('/inventory-value', reportController.getInventoryValueReport);
router.get('/low-stock', reportController.getLowStockReport);
router.get('/categories', reportController.getCategoryReport);

// Activity Log
router.get('/activity-log', reportController.getActivityLog);

export default router;