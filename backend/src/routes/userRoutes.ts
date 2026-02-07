import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, isAdmin);

router.get('/', userController.listUsers);
router.get('/pending', userController.listPendingUsers);
router.patch('/:id/role', userController.updateRole);
router.post('/:id/approve', userController.approveUser);
router.post('/:id/reject', userController.rejectUser);
router.delete('/:id', userController.deleteUser);

export default router;
