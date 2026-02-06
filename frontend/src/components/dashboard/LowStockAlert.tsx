'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  category: {
    name: string;
  };
}

interface LowStockAlertProps {
  products: Product[];
  onReorder?: () => void;
}

export default function LowStockAlert({ products, onReorder }: LowStockAlertProps) {
  const totalDeficit = products.reduce(
    (sum, product) => sum + Math.max(0, product.reorderLevel - product.currentStock),
    0
  );
  const [reorderLoading, setReorderLoading] = useState<Record<string, boolean>>({});

  const handleReorderAll = async () => {
    const count = products.length;
    if (count === 0) {
      toast.info('No low-stock items to reorder');
      return;
    }
    try {
      const response = await api.post('/stock/reorder-all');
      const reorderedCount = response.data?.data?.reorderedCount ?? count;
      const totalQuantity = response.data?.data?.totalQuantity ?? 0;
      toast.success(`Reordered ${reorderedCount} item${reorderedCount !== 1 ? 's' : ''} (${totalQuantity} units)`);
      onReorder?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reorder stock');
    }
  };

  const handleReorderOne = async (product: Product) => {
    const deficit = Math.max(0, product.reorderLevel - product.currentStock);
    if (deficit === 0) {
      toast.info(`${product.name} is already at or above reorder level`);
      return;
    }
    setReorderLoading((prev) => ({ ...prev, [product.id]: true }));
    try {
      await api.post('/stock/in', {
        productId: product.id,
        quantity: deficit,
        notes: 'Quick reorder to minimum level',
      });
      toast.success(`Reordered ${deficit} ${product.name} units`);
      onReorder?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reorder item');
    } finally {
      setReorderLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <Card className="border-border/60 bg-background/70 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Low Stock Alert</CardTitle>
          </div>
          <Badge variant="destructive">{products.length}</Badge>
        </div>
        <CardDescription>
          Products that need reordering
        </CardDescription>
        {products.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
              Items: <span className="text-foreground">{products.length}</span>
            </span>
            <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
              Total Deficit: <span className="text-foreground">{totalDeficit}</span>
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <AlertTriangle className="h-6 w-6 text-green-600" />
            </div>
            <p className="mt-4 text-sm font-medium">All products well stocked!</p>
            <p className="text-xs text-muted-foreground">No items below reorder level</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {products.map((product, index) => {
                const deficit = Math.max(0, product.reorderLevel - product.currentStock);
                const isLoading = Boolean(reorderLoading[product.id]);
                return (
                <div key={product.id}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {product.category.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant="destructive" className="font-mono">
                          {product.currentStock}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Min: {product.reorderLevel}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Deficit: {deficit}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deficit === 0 || isLoading}
                        onClick={() => handleReorderOne(product)}
                      >
                        {isLoading ? 'Reordering...' : 'Reorder'}
                      </Button>
                    </div>
                  </div>
                  {index < products.length - 1 && <Separator className="my-4" />}
                </div>
              )})}
            </div>
          </ScrollArea>
        )}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button className="w-full" variant="outline" asChild>
            <Link href="/dashboard/stock">
              Go to Stock
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {products.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  Reorder All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reorder all low-stock items?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will create stock-in movements to bring each item up to its reorder level.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReorderAll}>
                    Confirm Reorder
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
