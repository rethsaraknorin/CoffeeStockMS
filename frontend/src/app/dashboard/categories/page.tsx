'use client';

import { useEffect, useState } from 'react';
import { Plus, FolderOpen, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CategoriesTable from './components/CategoriesTable';
import AddCategoryDialog from './components/AddCategoryDialog';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  id: string;
  name: string;
  description: string;
  _count?: {
    products: number;
  };
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const totalProducts = categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0);

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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Categories</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Organize your products into categories
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Total: {categories.length}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Products: {totalProducts}
              </span>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

          <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

          <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
            <Badge variant="outline">
              {categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0 ? (totalProducts / categories.length).toFixed(1) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Products per category</p>
          </CardContent>
        </Card>
        </div>

        {/* Categories Table */}
        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              Manage your product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoriesTable categories={categories} onRefresh={handleRefresh} />
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <AddCategoryDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleRefresh}
        />
      </div>
    </div>
  );
}
