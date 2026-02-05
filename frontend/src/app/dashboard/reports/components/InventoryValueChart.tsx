'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Product {
  name: string;
  currentStock: number;
  unitPrice: number;
  stockValue: number;
}

interface InventoryValueChartProps {
  products: Product[];
}

export default function InventoryValueChart({ products }: InventoryValueChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof document === 'undefined') return;
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const axisTickColor = isDark ? '#ffffff' : '#0f172a';

  const chartData = products.slice(0, 10).map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    value: Number(product.stockValue).toFixed(2),
    stock: Number(product.currentStock),
  }));

  return (
    <Card className="relative overflow-hidden border-border/60 bg-background/70 backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-purple-500/10 to-transparent dark:from-purple-400/10" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          Top Products by Value
        </CardTitle>
        <CardDescription>
          Products with highest inventory value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="inventoryValueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.35} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: axisTickColor, fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              tick={{ fill: axisTickColor }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}
              formatter={(value: any) => [`$${value}`, 'Value']}
              cursor={{ fill: 'rgba(196, 181, 253, 0.35)' }}
            />
            <Bar 
              dataKey="value" 
              fill="url(#inventoryValueGradient)" 
              radius={[10, 10, 4, 4]}
              activeBar={{ fill: '#c4b5fd' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
