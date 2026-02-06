'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, ReferenceLine } from 'recharts';

interface StockChartProps {
  data: Array<{
    name: string;
    stock: number;
    reorderLevel: number;
  }>;
}

export default function StockChart({ data }: StockChartProps) {
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
  const avgReorder = useMemo(() => {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, item) => sum + item.reorderLevel, 0);
    return Math.round(total / data.length);
  }, [data]);

  const lowStockCount = useMemo(() => {
    return data.filter((item) => item.stock <= item.reorderLevel).length;
  }, [data]);

  const maxStock = useMemo(() => {
    return data.reduce((max, item) => Math.max(max, item.stock), 0);
  }, [data]);

  return (
    <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500 bg-gradient-to-br from-card via-card to-slate-50/40 dark:to-slate-950/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/10 to-transparent dark:from-blue-400/10" />
      <CardHeader className="relative pb-3">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Stock Overview
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Current stock levels vs reorder points
        </CardDescription>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
            Low Stock: <span className="text-foreground">{lowStockCount}</span>
          </span>
          <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
            Avg Reorder: <span className="text-foreground">{avgReorder}</span>
          </span>
          <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
            Max Stock: <span className="text-foreground">{maxStock}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="relative px-2 sm:px-6">
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100/70 dark:bg-slate-900/50">
            <TabsTrigger value="bar" className="text-xs sm:text-sm">📊 Bar Chart</TabsTrigger>
            <TabsTrigger value="line" className="text-xs sm:text-sm">📈 Line Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="space-y-4">
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
              <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                  </linearGradient>
                  <linearGradient id="reorderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0.45} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.35} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  stroke="hsl(var(--border))"
                />
                {avgReorder > 0 && (
                  <ReferenceLine
                    y={avgReorder}
                    stroke="var(--chart-4)"
                    strokeDasharray="6 6"
                    label={{
                      value: `Avg reorder ${avgReorder}`,
                      position: 'right',
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 10
                    }}
                  />
                )}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: 'color-mix(in oklab, var(--chart-1) 12%, transparent)' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconSize={12}
                />
                <Bar 
                  dataKey="stock" 
                  fill="url(#stockGradient)" 
                  radius={[8, 8, 0, 0]} 
                  name="Current Stock"
                  maxBarSize={50}
                />
                <Bar 
                  dataKey="reorderLevel" 
                  fill="url(#reorderGradient)" 
                  radius={[8, 8, 0, 0]} 
                  name="Reorder Level"
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="line" className="space-y-4">
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="stockLineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="reorderLineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.35} />
                <XAxis 
                  dataKey="name"
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  stroke="hsl(var(--border))"
                />
                {avgReorder > 0 && (
                  <ReferenceLine
                    y={avgReorder}
                    stroke="var(--chart-4)"
                    strokeDasharray="6 6"
                    label={{
                      value: `Avg reorder ${avgReorder}`,
                      position: 'right',
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 10
                    }}
                  />
                )}
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ stroke: 'var(--chart-1)', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconSize={12}
                />
                <Line 
                  type="monotone" 
                  dataKey="stock" 
                  stroke="var(--chart-1)" 
                  strokeWidth={3} 
                  name="Current Stock"
                  dot={{ fill: 'var(--chart-1)', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: 'var(--chart-1)', stroke: '#fff', strokeWidth: 2 }}
                  fill="url(#stockLineGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="reorderLevel" 
                  stroke="var(--chart-4)" 
                  strokeWidth={3} 
                  name="Reorder Level"
                  dot={{ fill: 'var(--chart-4)', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: 'var(--chart-4)', stroke: '#fff', strokeWidth: 2 }}
                  strokeDasharray="5 5"
                  fill="url(#reorderLineGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
