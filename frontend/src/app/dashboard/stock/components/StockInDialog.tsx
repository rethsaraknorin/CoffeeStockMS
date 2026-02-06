'use client';

import { useEffect, useState } from 'react';
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

const stockSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
});

type StockForm = z.infer<typeof stockSchema>;

interface Product {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
}

interface StockInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess: () => void;
}

export default function StockInDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: StockInDialogProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<StockForm>({
    resolver: zodResolver(stockSchema),
  });

  const quantity = watch('quantity');
  const currentStock = Number(product.currentStock);
  const newStock = currentStock + (quantity || 0);

  useEffect(() => {
    if (open) {
      reset({ quantity: 1, notes: '' });
    }
  }, [open, reset]);

  const onSubmit = async (data: StockForm) => {
    setLoading(true);
    try {
      await api.post('/stock/in', {
        productId: product.id,
        quantity: data.quantity,
        notes: data.notes || '',
      });
      
      toast.success(`Added ${data.quantity} ${product.unit} to ${product.name}`);
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock (IN)</DialogTitle>
          <DialogDescription>
            Add incoming stock for {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Product</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                Current Stock: {Number(product.currentStock)} {product.unit}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Add *</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              placeholder="50"
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              New stock will be: {newStock} {product.unit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g., New shipment from supplier"
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
