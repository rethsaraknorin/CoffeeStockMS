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
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Stock Overview</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Current stock levels vs reorder points
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <Tabs defaultValue="bar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bar" className="text-xs sm:text-sm">Bar Chart</TabsTrigger>
            <TabsTrigger value="line" className="text-xs sm:text-sm">Line Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="space-y-4">
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
              <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconSize={12}
                />
                <Bar 
                  dataKey="stock" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  name="Current Stock"
                  maxBarSize={50}
                />
                <Bar 
                  dataKey="reorderLevel" 
                  fill="hsl(var(--destructive))" 
                  radius={[4, 4, 0, 0]} 
                  name="Reorder Level"
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="line" className="space-y-4">
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis 
                  dataKey="name"
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconSize={12}
                />
                <Line 
                  type="monotone" 
                  dataKey="stock" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  name="Current Stock"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reorderLevel" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2} 
                  name="Reorder Level"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}