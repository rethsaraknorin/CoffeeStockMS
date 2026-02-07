import { Router } from 'express';
import { supplierController } from '../controllers/supplierController';
import { authenticate, isAdmin, requireActiveUser } from '../middleware/auth';

const router = Router();

// All supplier routes require authentication
router.use(authenticate);

router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.post('/', requireActiveUser, supplierController.createSupplier);
router.put('/:id', requireActiveUser, supplierController.updateSupplier);
router.delete('/:id', requireActiveUser, isAdmin, supplierController.deleteSupplier);

export default router;
