'use client';

import { useEffect, useState } from 'react';
import { Package, DollarSign, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import StockChart from '@/components/dashboard/StockChart';
import LowStockAlert from '@/components/dashboard/LowStockAlert';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';

interface DashboardData {
  overview: {
    totalProducts: number;
    totalCategories: number;
    totalSuppliers: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalStockValue: string;
  };
  movements: {
    today: number;
    thisMonth: number;
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    currentStock: number;
    reorderLevel: number;
    category: {
      name: string;
    };
  }>;
  topProductsByValue: Array<{
    name: string;
    currentStock: number;
    unitPrice: number;
    stockValue: number;
  }>;
}

interface StockMovement {
  id: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  product: {
    name: string;
    sku: string;
  };
  createdBy: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentActivity, setRecentActivity] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const dashboardResponse = await api.get('/reports/dashboard');
      setDashboardData(dashboardResponse.data.data);

      const movementsResponse = await api.get('/stock/movements?page=1&limit=5');
      setRecentActivity(movementsResponse.data.data.movements || []);
      
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const chartData = dashboardData?.topProductsByValue.slice(0, 8).map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    stock: product.currentStock,
    reorderLevel: 10,
  })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Package className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <p className="text-lg text-muted-foreground">No data available</p>
          <Button onClick={fetchDashboardData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Monitor your inventory and stock movements in real-time
            </p>
            <div className="flex flex-wrap gap-2 text-xs pt-2">
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Products: {dashboardData.overview.totalProducts}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Low Stock: {dashboardData.overview.lowStockCount}
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
                Out of Stock: {dashboardData.overview.outOfStockCount}
              </span>
            </div>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="default"
            className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard
            title="Total Products"
            value={dashboardData.overview.totalProducts}
            icon={Package}
            description={`${dashboardData.overview.totalCategories} categories`}
            className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow"
          />
          
          <StatsCard
            title="Stock Value"
            value={`$${parseFloat(dashboardData.overview.totalStockValue).toLocaleString()}`}
            icon={DollarSign}
            description="Total inventory worth"
            className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow"
          />
          
          <StatsCard
            title="Low Stock"
            value={dashboardData.overview.lowStockCount}
            icon={AlertTriangle}
            description={`${dashboardData.overview.outOfStockCount} out of stock`}
            className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow"
          />
          
          <StatsCard
            title="Today's Activity"
            value={dashboardData.movements.today}
            icon={TrendingUp}
            description={`${dashboardData.movements.thisMonth} this month`}
            className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow"
          />
        </div>

        {/* Charts and Alerts Row - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="order-2 xl:order-1">
            <StockChart data={chartData} />
          </div>
          
          <div className="order-1 xl:order-2">
            <LowStockAlert
              products={dashboardData.lowStockProducts.slice(0, 5)}
              onReorder={fetchDashboardData}
            />
          </div>
        </div>

        {/* Recent Activity - Full Width */}
        <div className="w-full">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
