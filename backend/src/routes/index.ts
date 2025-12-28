import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import supplierRoutes from './supplierRoutes';
import stockRoutes from './stockRoutes';
import reportRoutes from './reportRoutes';
import exportRoutes from './exportRoutes';
import notificationRoutes from './notificationRoutes';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is healthy! ✅',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/stock', stockRoutes);
router.use('/reports', reportRoutes);
router.use('/export', exportRoutes);
router.use('/notifications', notificationRoutes);

export default router;