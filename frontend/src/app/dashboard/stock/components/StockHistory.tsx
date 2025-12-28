'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { toast } from 'sonner';

interface StockMovement {
  id: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  notes: string;
  createdBy: string;
  createdAt: string;
  product: {
    name: string;
    sku: string;
  };
}

const typeConfig = {
  IN: { icon: TrendingUp, variant: 'default' as const, label: 'Stock In', color: 'text-green-600' },
  OUT: { icon: TrendingDown, variant: 'destructive' as const, label: 'Stock Out', color: 'text-red-600' },
  ADJUSTMENT: { icon: Settings, variant: 'secondary' as const, label: 'Adjustment', color: 'text-blue-600' },
};

export default function StockHistory() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stock/movements?page=1&limit=50');
      setMovements(response.data.data.movements || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load stock history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movement History</CardTitle>
        <CardDescription>
          Complete history of all stock movements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">No stock movements yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {movements.map((movement) => {
                const config = typeConfig[movement.type];
                const Icon = config.icon;
                
                return (
                  <div
                    key={movement.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className={`mt-1 rounded-full p-2 ${
                      movement.type === 'IN' ? 'bg-green-100 dark:bg-green-900/20' :
                      movement.type === 'OUT' ? 'bg-red-100 dark:bg-red-900/20' :
                      'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{movement.product.name}</p>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        SKU: {movement.product.sku}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">
                          {movement.type === 'ADJUSTMENT' && movement.quantity > 0 ? '+' : ''}
                          {movement.quantity} units
                        </span>
                        {movement.notes && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{movement.notes}</span>
                          </>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        by {movement.createdBy} • {new Date(movement.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}