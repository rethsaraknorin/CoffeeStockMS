import { Router } from 'express';
import { supplierController } from '../controllers/supplierController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', supplierController.getAllSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.post('/', authenticate, supplierController.createSupplier);
router.put('/:id', authenticate, supplierController.updateSupplier);
router.delete('/:id', authenticate, isAdmin, supplierController.deleteSupplier);

export default router;