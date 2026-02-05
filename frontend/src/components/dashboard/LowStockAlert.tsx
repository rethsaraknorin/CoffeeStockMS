'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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

  return (
    <Card>
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
              {products.map((product, index) => (
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
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <Badge variant="destructive" className="font-mono">
                          {product.currentStock}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Min: {product.reorderLevel}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < products.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        {products.length > 0 && (
          <Button className="w-full mt-4" variant="outline" onClick={handleReorderAll}>
            Reorder All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
