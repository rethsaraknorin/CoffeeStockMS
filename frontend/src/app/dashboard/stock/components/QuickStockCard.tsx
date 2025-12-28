'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Settings } from 'lucide-react';

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

interface QuickStockCardProps {
  product: Product;
  onStockIn: () => void;
  onStockOut: () => void;
  onAdjust: () => void;
}

export default function QuickStockCard({
  product,
  onStockIn,
  onStockOut,
  onAdjust,
}: QuickStockCardProps) {
  const stock = Number(product.currentStock);
  const reorder = Number(product.reorderLevel);
  
  const getStockStatus = () => {
    if (stock === 0) return { variant: 'destructive' as const, label: 'Out of Stock' };
    if (stock <= reorder) return { variant: 'secondary' as const, label: 'Low Stock' };
    return { variant: 'default' as const, label: 'In Stock' };
  };

  const status = getStockStatus();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{product.name}</CardTitle>
            <CardDescription className="text-xs">
              SKU: {product.sku} • {product.category.name}
            </CardDescription>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Stock</span>
          <span className="text-lg font-bold">
            {stock} {product.unit}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Reorder Level</span>
          <span className="text-sm">{reorder} {product.unit}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={onStockIn} className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            In
          </Button>
          <Button size="sm" variant="outline" onClick={onStockOut} className="text-xs">
            <TrendingDown className="h-3 w-3 mr-1" />
            Out
          </Button>
          <Button size="sm" variant="outline" onClick={onAdjust} className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Adj
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}