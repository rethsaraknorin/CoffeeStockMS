import { Router } from 'express';
import { supplierController } from '../controllers/supplierController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// All supplier routes require authentication
router.use(authenticate);

router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.post('/', supplierController.createSupplier);
router.put('/:id', supplierController.updateSupplier);
router.delete('/:id', isAdmin, supplierController.deleteSupplier);

export default router;
