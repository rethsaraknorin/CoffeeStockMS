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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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

interface StockOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess: () => void;
}

export default function StockOutDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: StockOutDialogProps) {
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
  const newStock = currentStock - (quantity || 0);

  const onSubmit = async (data: StockForm) => {
    if (data.quantity > currentStock) {
      toast.error('Cannot remove more than available stock');
      return;
    }

    setLoading(true);
    try {
      await api.post('/stock/out', {
        productId: product.id,
        quantity: data.quantity,
        notes: data.notes || '',
      });
      
      toast.success(`Removed ${data.quantity} ${product.unit} from ${product.name}`);
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Stock (OUT)</DialogTitle>
          <DialogDescription>
            Remove stock for sale or usage: {product.name}
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
            <Label htmlFor="quantity">Quantity to Remove *</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="10"
              {...register('quantity', { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
            {quantity && quantity > currentStock && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Insufficient stock! Available: {currentStock} {product.unit}
                </AlertDescription>
              </Alert>
            )}
            {quantity && quantity <= currentStock && (
              <p className="text-xs text-muted-foreground">
                New stock will be: {newStock} {product.unit}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Sold to customer, Damaged items"
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (quantity && quantity > currentStock)}
              variant="destructive"
            >
              {loading ? 'Removing...' : 'Remove Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}