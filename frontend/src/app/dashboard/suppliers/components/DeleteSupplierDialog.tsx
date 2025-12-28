'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

interface DeleteSupplierDialogProps {
  supplier: Supplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function DeleteSupplierDialog({
  supplier,
  open,
  onOpenChange,
  onSuccess,
}: DeleteSupplierDialogProps) {
  const [loading, setLoading] = useState(false);
  const productCount = supplier._count?.products || 0;

  const handleDelete = async () => {
    if (productCount > 0) {
      toast.error(`Cannot delete supplier with ${productCount} products`);
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/suppliers/${supplier.id}`);
      toast.success('Supplier deleted successfully!');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {productCount > 0 ? (
              <>
                This supplier has <strong>{productCount} products</strong>. 
                You must remove or reassign these products before deleting this supplier.
              </>
            ) : (
              <>
                This will permanently delete <strong>{supplier.name}</strong>.
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading || productCount > 0}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}