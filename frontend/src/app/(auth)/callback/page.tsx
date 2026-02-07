'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Missing authentication token');
      return;
    }

    const run = async () => {
      try {
        localStorage.setItem('token', token);
        const response = await api.get('/auth/profile');
        const user = response.data.data;
        setAuth(user, token);
        router.push('/dashboard');
      } catch (err: any) {
        setError('Failed to complete sign-in');
      }
    };

    run();
  }, [searchParams, router, setAuth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
