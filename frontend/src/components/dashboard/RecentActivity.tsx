'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Settings, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
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

interface RecentActivityProps {
  activities: Activity[];
}

const typeConfig = {
  IN: {
    icon: TrendingUp,
    label: 'In',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30',
    badgeClass:
      'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/50'
  },
  OUT: {
    icon: TrendingDown,
    label: 'Out',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30',
    badgeClass:
      'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/50'
  },
  ADJUSTMENT: {
    icon: Settings,
    label: 'Adjust',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    badgeClass:
      'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/50'
  }
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  const latestActivity = activities[0];

  const getQuantityPrefix = (type: Activity['type']) => {
    if (type === 'IN') return '+';
    if (type === 'OUT') return '-';
    return 'adj';
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-purple-500 border-border/60 bg-background/70 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Latest stock movements
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {latestActivity && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Updated {new Date(latestActivity.createdAt).toLocaleDateString()}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {activities.length} items
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-slate-100 p-3 mb-3 dark:bg-slate-800/60">
              <Clock className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-1">Stock movements will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] sm:h-[320px] pr-2">
            <div className="space-y-2">
              {activities.map((activity) => {
                const config = typeConfig[activity.type];
                const Icon = config.icon;

                return (
                  <div
                    key={activity.id}
                    className={cn(
                      'group relative rounded-lg border p-3 transition-all hover:shadow-sm hover:border-primary/50 dark:border-white/10',
                      config.bg
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'rounded-lg p-2 flex-shrink-0 transition-transform group-hover:scale-110',
                          activity.type === 'IN' && 'bg-green-500/10 dark:bg-green-500/15',
                          activity.type === 'OUT' && 'bg-red-500/10 dark:bg-red-500/15',
                          activity.type === 'ADJUSTMENT' && 'bg-blue-500/10 dark:bg-blue-500/15'
                        )}
                      >
                        <Icon className={cn('h-4 w-4', config.color)} />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                            {activity.product.name}
                          </h4>
                          <Badge className={cn('text-xs font-medium', config.badgeClass)}>
                            {config.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-medium">
                            {getQuantityPrefix(activity.type)}{activity.quantity} units
                          </span>
                          <span>-</span>
                          <span className="truncate">SKU: {activity.product.sku}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(activity.createdAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span>-</span>
                          <span className="truncate">by {activity.createdBy || 'System'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
