'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, hydrated, isAuthenticated, router]);

  if (!mounted || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 md:pl-64">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-20 border-b bg-background/80 p-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
