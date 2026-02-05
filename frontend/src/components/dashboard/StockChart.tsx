'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

interface StockChartProps {
  data: Array<{
    name: string;
    stock: number;
    reorderLevel: number;
  }>;
}

export default function StockChart({ data }: StockChartProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Stock Overview
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Current stock levels vs reorder points
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bar" className="text-xs sm:text-sm">📊 Bar Chart</TabsTrigger>
            <TabsTrigger value="line" className="text-xs sm:text-sm">📈 Line Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="space-y-4">
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
              <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="reorderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="#cbd5e1"
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  stroke="#cbd5e1"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="#cbd5e1"
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  stroke="#cbd5e1"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
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
