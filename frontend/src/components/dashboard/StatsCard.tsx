import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  meta?: Array<{
    label: string;
    value: string | number;
  }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  meta,
  trend,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn('border-border/60 bg-background/70 backdrop-blur', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/60 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {meta && meta.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {meta.map((item) => (
              <span
                key={item.label}
                className="rounded-full border border-border bg-background/70 px-2.5 py-1"
              >
                {item.label}: <span className="text-foreground">{item.value}</span>
              </span>
            ))}
          </div>
        )}
        {trend && (
          <p className={cn(
            'text-xs mt-1',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
