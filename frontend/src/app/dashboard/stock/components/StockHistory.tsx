'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovements, setTotalMovements] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchHistory();
  }, [currentPage, startDate, endDate]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stock/movements', {
        params: {
          page: currentPage,
          limit: pageSize,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }
      });
      const data = response.data.data;
      setMovements(data.movements || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalMovements(data.pagination?.total || 0);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load stock history');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Card className="border-border/60 bg-background/70 backdrop-blur">
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
    <Card className="border-border/60 bg-background/70 backdrop-blur">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Stock Movement History</CardTitle>
            <CardDescription>
              Complete history of all stock movements
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full sm:w-[150px]"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full sm:w-[150px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={!startDate && !endDate}
              className="h-9"
            >
              Clear
            </Button>
          </div>
        </div>
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
                    <div
                      className={`mt-1 rounded-full p-2 ${
                        movement.type === 'IN'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : movement.type === 'OUT'
                          ? 'bg-red-100 dark:bg-red-900/20'
                          : 'bg-blue-100 dark:bg-blue-900/20'
                      }`}
                    >
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
                            <span className="text-muted-foreground">-</span>
                            <span className="text-muted-foreground">{movement.notes}</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        by {movement.createdBy} - {new Date(movement.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
        {totalMovements > 0 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row">
            <div>
              Showing{' '}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-foreground">
                {Math.min(currentPage * pageSize, totalMovements)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-foreground">{totalMovements}</span> movements
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <span className="min-w-[90px] text-center">
                Page{' '}
                <span className="font-medium text-foreground">{currentPage}</span> of{' '}
                <span className="font-medium text-foreground">{totalPages}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
