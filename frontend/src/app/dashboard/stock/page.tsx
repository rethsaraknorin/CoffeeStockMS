'use client';

import { useEffect, useState } from 'react';
import { Package, TrendingUp, TrendingDown, Settings, History, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import StockInDialog from './components/StockInDialog';
import StockOutDialog from './components/StockOutDialog';
import StockAdjustmentDialog from './components/StockAdjustmentDialog';
import StockHistory from './components/StockHistory';
import QuickStockCard from './components/QuickStockCard';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  category: {
    name: string;
  };
}

interface StockSummary {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: string;
  recentMovementsCount: number;
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogType, setDialogType] = useState<'in' | 'out' | 'adjust' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await api.get('/products');
      setProducts(productsResponse.data.data.products || []);

      // Fetch stock summary
      const summaryResponse = await api.get('/stock/summary');
      setSummary(summaryResponse.data.data);
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setDialogType(null);
    setSelectedProduct(null);
  };

  const openDialog = (type: 'in' | 'out' | 'adjust', product: Product) => {
    setSelectedProduct(product);
    setDialogType(type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-1/2" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Stock Management</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage inventory movements and track stock levels
            </p>
            {summary && (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                  Stock Value: ${Number(summary.totalStockValue || 0).toLocaleString()}
                </span>
                <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                  Low Stock: {summary.lowStockProducts}
                </span>
                <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                  Out of Stock: {summary.outOfStockProducts}
                </span>
              </div>
            )}
          </div>
          <Button onClick={handleRefresh} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  In inventory
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.lowStockProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Need reordering
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <Package className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.outOfStockProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Urgent action needed
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.recentMovementsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="quick" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/70 dark:bg-slate-900/50 sm:inline-flex sm:w-auto">
            <TabsTrigger value="quick" className="text-xs sm:text-sm">Quick Actions</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">Stock History</TabsTrigger>
          </TabsList>

          {/* Quick Actions Tab */}
          <TabsContent value="quick" className="space-y-4">
            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader>
                <CardTitle>Quick Stock Actions</CardTitle>
                <CardDescription>
                  Select a product to add, remove, or adjust stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <QuickStockCard
                      key={product.id}
                      product={product}
                      onStockIn={() => openDialog('in', product)}
                      onStockOut={() => openDialog('out', product)}
                      onAdjust={() => openDialog('adjust', product)}
                    />
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No products found</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add products first to manage stock
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <StockHistory />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        {selectedProduct && (
          <>
            <StockInDialog
              open={dialogType === 'in'}
              onOpenChange={(open) => !open && setDialogType(null)}
              product={selectedProduct}
              onSuccess={handleRefresh}
            />

            <StockOutDialog
              open={dialogType === 'out'}
              onOpenChange={(open) => !open && setDialogType(null)}
              product={selectedProduct}
              onSuccess={handleRefresh}
            />

            <StockAdjustmentDialog
              open={dialogType === 'adjust'}
              onOpenChange={(open) => !open && setDialogType(null)}
              product={selectedProduct}
              onSuccess={handleRefresh}
            />
          </>
        )}
      </div>
    </div>
  );
}
