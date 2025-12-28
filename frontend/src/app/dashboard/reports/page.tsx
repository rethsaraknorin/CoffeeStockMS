'use client';

import { useEffect, useState } from 'react';
import { 
  FileDown, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Package,
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InventoryValueChart from './components/InventoryValueChart';
import CategoryPerformance from './components/CategoryPerformance';
import StockMovementChart from './components/StockMovementChart';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  overview: {
    totalProducts: number;
    totalStockValue: string;
    lowStockCount: number;
    outOfStockCount: number;
  };
  movements: {
    today: number;
    thisMonth: number;
    breakdown: Array<{
      type: string;
      _count: { type: number };
      _sum: { quantity: number };
    }>;
  };
  topProductsByValue: Array<{
    name: string;
    currentStock: number;
    unitPrice: number;
    stockValue: number;
  }>;
}

export default function ReportsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports/dashboard');
      setData(response.data.data);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    setExportLoading(type);
    try {
      let url = '';
      let filename = '';

      switch (type) {
        case 'inventory-excel':
          url = '/export/excel/inventory';
          filename = `inventory-${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'low-stock-excel':
          url = '/export/excel/low-stock';
          filename = `low-stock-${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'movements-excel':
          url = `/export/excel/stock-movements?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
          filename = `movements-${dateRange.startDate}-to-${dateRange.endDate}.xlsx`;
          break;
        case 'inventory-pdf':
          url = '/export/pdf/inventory';
          filename = `inventory-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
      }

      const response = await api.get(url, {
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      
      toast.success('Report exported successfully!');
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    } finally {
      setExportLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 space-y-4 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Export reports and view inventory analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(data.overview.totalStockValue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total inventory worth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.movements.thisMonth}</div>
            <p className="text-xs text-muted-foreground">Stock movements</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="export">Export Reports</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <InventoryValueChart products={data.topProductsByValue} />
            <StockMovementChart breakdown={data.movements.breakdown} />
          </div>

          <CategoryPerformance />
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          {/* Excel Exports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Excel Reports
              </CardTitle>
              <CardDescription>
                Download detailed reports in Excel format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Inventory Report */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Full Inventory Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete inventory with stock levels and values
                  </p>
                </div>
                <Button
                  onClick={() => handleExport('inventory-excel')}
                  disabled={exportLoading === 'inventory-excel'}
                >
                  {exportLoading === 'inventory-excel' ? (
                    'Exporting...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Excel
                    </>
                  )}
                </Button>
              </div>

              {/* Low Stock Report */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Low Stock Alert Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Products below reorder level with cost estimates
                  </p>
                </div>
                <Button
                  onClick={() => handleExport('low-stock-excel')}
                  disabled={exportLoading === 'low-stock-excel'}
                  variant="outline"
                >
                  {exportLoading === 'low-stock-excel' ? (
                    'Exporting...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Excel
                    </>
                  )}
                </Button>
              </div>

              {/* Stock Movements Report */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Stock Movements Report</h4>
                  <p className="text-sm text-muted-foreground">
                    All stock IN/OUT movements for selected period
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleExport('movements-excel')}
                  disabled={exportLoading === 'movements-excel'}
                  className="w-full"
                  variant="outline"
                >
                  {exportLoading === 'movements-excel' ? (
                    'Exporting...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Excel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PDF Exports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDown className="h-5 w-5" />
                PDF Reports
              </CardTitle>
              <CardDescription>
                Download professional PDF reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Inventory PDF Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional inventory report with summary
                  </p>
                </div>
                <Button
                  onClick={() => handleExport('inventory-pdf')}
                  disabled={exportLoading === 'inventory-pdf'}
                  variant="outline"
                >
                  {exportLoading === 'inventory-pdf' ? (
                    'Exporting...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
