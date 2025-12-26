"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  FolderOpen,
  Users,
  AlertTriangle,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function DashboardPage() {
  // TODO: Fetch these from API
  const stats = {
    totalProducts: 156,
    totalCategories: 12,
    totalSuppliers: 8,
    lowStockItems: 5,
  };

  // TODO: Fetch from API
  const lowStockProducts = [
    { id: "1", name: "Arabica Coffee Beans", currentStock: 5, reorderLevel: 10 },
    { id: "2", name: "Espresso Roast", currentStock: 3, reorderLevel: 15 },
    { id: "3", name: "Decaf Blend", currentStock: 7, reorderLevel: 10 },
  ];

  // TODO: Fetch from API
  const recentMovements = [
    {
      id: "1",
      product: "Colombian Supreme",
      type: "IN",
      quantity: 50,
      date: "2024-01-15",
    },
    {
      id: "2",
      product: "House Blend",
      type: "OUT",
      quantity: 20,
      date: "2024-01-15",
    },
    {
      id: "3",
      product: "Dark Roast",
      type: "ADJUSTMENT",
      quantity: 5,
      date: "2024-01-14",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's your stock overview.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Products
              </CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-gray-500 mt-1">Active items in stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categories
              </CardTitle>
              <FolderOpen className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-gray-500 mt-1">Product categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Suppliers
              </CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
              <p className="text-xs text-gray-500 mt-1">Active suppliers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Low Stock
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.lowStockItems}
              </div>
              <p className="text-xs text-gray-500 mt-1">Items need reorder</p>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Low Stock Alert</AlertTitle>
            <AlertDescription>
              You have {lowStockProducts.length} products below reorder level. Please restock soon.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Products */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Stock: {product.currentStock} / Reorder: {product.reorderLevel}
                      </p>
                    </div>
                    <Badge variant="destructive">Low</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Stock Movements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {movement.type === "IN" ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : movement.type === "OUT" ? (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      ) : (
                        <Package className="h-5 w-5 text-blue-600" />
                      )}
                      <div>
                        <p className="font-medium">{movement.product}</p>
                        <p className="text-sm text-gray-500">{movement.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          movement.type === "IN"
                            ? "default"
                            : movement.type === "OUT"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {movement.type}
                      </Badge>
                      <p className="text-sm mt-1">{movement.quantity} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}