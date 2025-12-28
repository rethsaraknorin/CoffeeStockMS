'use client';

import { useState } from 'react';
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
  quantity: z.number().refine((val) => val !== 0, 'Adjustment cannot be zero'),
  notes: z.string().min(1, 'Notes are required for adjustments'),
});

type StockForm = z.infer<typeof stockSchema>;

interface Product {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
}

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess: () => void;
}

export default function StockAdjustmentDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: StockAdjustmentDialogProps) {
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

  const onSubmit = async (data: StockForm) => {
    if (newStock < 0) {
      toast.error('Adjustment would result in negative stock');
      return;
    }

    setLoading(true);
    try {
      await api.post('/stock/adjust', {
        productId: product.id,
        quantity: data.quantity,
        notes: data.notes,
      });
      
      const action = data.quantity > 0 ? 'added' : 'removed';
      toast.success(`Adjustment: ${Math.abs(data.quantity)} ${product.unit} ${action}`);
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Manual stock adjustment for {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Product</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                Current Stock: {currentStock} {product.unit}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Adjustment Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="+5 or -3"
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use positive (+) to add or negative (-) to remove
            </p>
            {quantity !== undefined && quantity !== 0 && (
              <p className="text-xs font-medium">
                New stock will be: {newStock} {product.unit}
                {newStock < 0 && <span className="text-destructive"> (Invalid!)</span>}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Reason for Adjustment *</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Inventory audit correction, Found damaged items"
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || newStock < 0}
            >
              {loading ? 'Adjusting...' : 'Adjust Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
