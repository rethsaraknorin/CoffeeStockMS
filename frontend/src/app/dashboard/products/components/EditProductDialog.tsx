'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(2, 'SKU must be at least 2 characters'),
  description: z.string().optional(),
  unitPrice: z.number().min(0, 'Price must be positive'),
  currentStock: z.number().min(0, 'Stock must be positive'),
  reorderLevel: z.number().min(0, 'Reorder level must be positive'),
  unit: z.string().min(1, 'Unit is required'),
});

type ProductForm = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  unitPrice: number;
  currentStock: number;
  reorderLevel: number;
  unit: string;
}

interface EditProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditProductDialog({
  product,
  open,
  onOpenChange,
  onSuccess,
}: EditProductDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      unitPrice: product.unitPrice,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
      unit: product.unit,
    },
  });

  useEffect(() => {
    reset({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      unitPrice: product.unitPrice,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
      unit: product.unit,
    });
  }, [product, reset]);

  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    try {
      await api.put(`/products/${product.id}`, data);
      toast.success('Product updated successfully!');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" {...register('sku')} />
              {errors.sku && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price ($) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                {...register('unitPrice', { valueAsNumber: true })}
              />
              {errors.unitPrice && (
                <p className="text-sm text-destructive">{errors.unitPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input id="unit" {...register('unit')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                type="number"
                {...register('currentStock', { valueAsNumber: true })}
              />
              {errors.currentStock && (
                <p className="text-sm text-destructive">{errors.currentStock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder Level *</Label>
              <Input
                id="reorderLevel"
                type="number"
                {...register('reorderLevel', { valueAsNumber: true })}
              />
              {errors.reorderLevel && (
                <p className="text-sm text-destructive">{errors.reorderLevel.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}