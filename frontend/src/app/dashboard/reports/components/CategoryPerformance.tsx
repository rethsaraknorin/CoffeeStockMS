'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, TrendingUp, TrendingDown } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface CategoryData {
  id: string;
  name: string;
  description: string;
  totalProducts: number;
  totalStock: number;
  totalValue: string;
  movementsLast30Days: {
    in: number;
    out: number;
    net: number;
  };
}

export default function CategoryPerformance() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryPerformance();
  }, []);

  const fetchCategoryPerformance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports/categories');
      setCategories(response.data.data.categories || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load category performance');
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
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
        <CardDescription>
          Performance metrics by category (Last 30 days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No categories found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Add categories to see performance metrics
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              const netMovement = category.movementsLast30Days.net;
              const isPositive = netMovement > 0;
              
              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{category.name}</h4>
                      <Badge variant="outline">
                        {category.totalProducts} products
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Stock Value</p>
                        <p className="font-medium">${Number(category.totalValue).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Items</p>
                        <p className="font-medium">{category.totalStock}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Movement (30d)</p>
                        <div className="flex items-center gap-1">
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{netMovement}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-xs text-muted-foreground">IN/OUT</div>
                    <div className="text-sm">
                      <span className="text-green-600">↑{category.movementsLast30Days.in}</span>
                      {' / '}
                      <span className="text-red-600">↓{category.movementsLast30Days.out}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}