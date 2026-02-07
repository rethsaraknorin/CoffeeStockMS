'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, hydrated, user, updateUser } = useAuthStore();
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

  useEffect(() => {
    if (!mounted || !hydrated || !isAuthenticated) return;
    const refreshProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        updateUser(response.data.data);
      } catch {
        // If profile refresh fails, keep existing state
      }
    };
    refreshProfile();
  }, [mounted, hydrated, isAuthenticated, updateUser]);

  if (!mounted || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:pl-64">
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
        {user?.status === 'PENDING' && (
          <div className="border-b border-border bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            Your account is pending admin approval. You can view data, but write actions are disabled.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
