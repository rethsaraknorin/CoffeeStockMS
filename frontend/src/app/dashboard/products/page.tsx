'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductsTable from './components/ProductsTable';
import AddProductDialog from './components/AddProductDialog';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  unitPrice: number;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  category: {
    id: string;
    name: string;
  };
  supplier?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [refreshKey, currentPage, debouncedSearch, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await api.get('/products', {
        params: {
          page: currentPage,
          limit: pageSize,
          search: debouncedSearch || undefined,
          categoryId: selectedCategory === 'all' ? undefined : selectedCategory
        }
      });
      const productsData = productsResponse.data.data;
      setProducts(productsData.products || []);
      setTotalProducts(productsData.pagination?.total || 0);
      setTotalPages(productsData.pagination?.totalPages || 1);
      
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await api.get('/categories');
      setCategories(categoriesResponse.data.data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-40 w-full" />
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
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Products</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your coffee shop inventory
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Total: {totalProducts}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Showing: {products.length}
              </span>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>
              Find products quickly using search and filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name or SKU..."
                    className="pl-8 bg-background/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[220px] bg-background/60">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Products List</CardTitle>
            <CardDescription>
              {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductsTable 
              products={products} 
              onRefresh={handleRefresh}
            />
            {totalProducts > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row">
                <div>
                  Showing{' '}
                  <span className="font-medium text-foreground">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium text-foreground">
                    {Math.min(currentPage * pageSize, totalProducts)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-foreground">{totalProducts}</span> products
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

        {/* Add Product Dialog */}
        <AddProductDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          categories={categories}
          onSuccess={handleRefresh}
        />
      </div>
    </div>
  );
}
