'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MovementBreakdown {
  type: string;
  _count: { type: number };
  _sum: { quantity: number };
}

interface StockMovementChartProps {
  breakdown: MovementBreakdown[];
}

const COLORS = {
  IN: 'hsl(142, 76%, 36%)',      // Green
  OUT: 'hsl(0, 84%, 60%)',       // Red
  ADJUSTMENT: 'hsl(217, 91%, 60%)', // Blue
};

export default function StockMovementChart({ breakdown }: StockMovementChartProps) {
  const chartData = breakdown.map(item => ({
    name: item.type,
    value: item._count.type,
    quantity: item._sum.quantity || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movement Types</CardTitle>
        <CardDescription>
          Distribution of stock movements this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                const pct = typeof percent === 'number' ? percent : 0;
                return `${name}: ${(pct * 100).toFixed(0)}%`;
              }}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
