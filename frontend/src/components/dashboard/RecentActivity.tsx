'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Settings } from 'lucide-react';
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
  IN: { icon: TrendingUp, variant: 'default' as const, label: 'Stock In', color: 'text-green-600' },
  OUT: { icon: TrendingDown, variant: 'destructive' as const, label: 'Stock Out', color: 'text-red-600' },
  ADJUSTMENT: { icon: Settings, variant: 'secondary' as const, label: 'Adjusted', color: 'text-blue-600' },
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Latest stock movements and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] sm:h-[350px] pr-2 sm:pr-4">
            <div className="space-y-3 sm:space-y-4">
              {activities.map((activity) => {
                const config = typeConfig[activity.type];
                const Icon = config.icon;
                
                return (
                  <div key={activity.id} className="flex items-start gap-3 sm:gap-4">
                    <div className={cn(
                      'mt-0.5 sm:mt-1 rounded-full p-1.5 sm:p-2 flex-shrink-0',
                      activity.type === 'IN' && 'bg-green-100 dark:bg-green-900/20',
                      activity.type === 'OUT' && 'bg-red-100 dark:bg-red-900/20',
                      activity.type === 'ADJUSTMENT' && 'bg-blue-100 dark:bg-blue-900/20'
                    )}>
                      <Icon className={cn('h-3 w-3 sm:h-4 sm:w-4', config.color)} />
                    </div>
                    
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-medium leading-tight truncate flex-1">
                          {activity.product.name}
                        </p>
                        <Badge variant={config.variant} className="text-xs flex-shrink-0">
                          {config.label}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          <span className="font-medium">{activity.quantity}</span> units
                        </p>
                        <span className="hidden sm:inline text-muted-foreground">•</span>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          by {activity.createdBy}
                        </p>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
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