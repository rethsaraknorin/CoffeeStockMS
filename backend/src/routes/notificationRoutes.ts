import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/low-stock-alert', notificationController.sendLowStockAlert);
router.post('/daily-summary', notificationController.sendDailySummary);

export default router;