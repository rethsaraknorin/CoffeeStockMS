import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, isAdmin);

router.get('/', userController.listUsers);
router.patch('/:id/role', userController.updateRole);
router.delete('/:id', userController.deleteUser);

export default router;
