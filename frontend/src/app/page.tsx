'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Coffee, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hydrated) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [mounted, hydrated, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-6 pb-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated Coffee Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                <Coffee className="h-12 w-12 text-primary-foreground animate-bounce" />
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Coffee Stock MS</h2>
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Loading your workspace...</p>
              </div>
            </div>

            {/* Loading Skeletons */}
            <div className="w-full space-y-3 pt-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5 mx-auto" />
              <Skeleton className="h-3 w-3/5 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}