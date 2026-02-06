'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import type { AuthResponse } from '@/types';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await api.post<AuthResponse>('/auth/register', {
        ...registerData,
        role: 'STAFF',
      });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        setAuth(user, token);
        toast.success('Registration successful!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 animate-in fade-in duration-700">
        <div className="w-full max-w-4xl grid gap-6 md:grid-cols-2">
          <div className="hidden md:flex flex-col justify-between rounded-2xl border bg-white/70 p-8 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/70 animate-in slide-in-from-left-6 fade-in duration-700">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                CS
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  Build Your Inventory Hub
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Create an account to manage stock with clarity and speed.
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-slate-900/60">
                One view for products, suppliers, and stock
              </div>
              <div className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-slate-900/60">
                Smart alerts for low inventory
              </div>
              <div className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-slate-900/60">
                Export reports when you need them
              </div>
            </div>
          </div>

          <Card className="w-full border-slate-200/70 bg-white/80 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/80 animate-in slide-in-from-right-6 fade-in duration-700">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>
                Sign up to get started with Coffee Shop Stock Management
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 pb-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    {...register('username')}
                    disabled={isLoading}
                    className="bg-white/70 dark:bg-slate-950/40"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    disabled={isLoading}
                    className="bg-white/70 dark:bg-slate-950/40"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    {...register('password')}
                    disabled={isLoading}
                    className="bg-white/70 dark:bg-slate-950/40"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="password"
                    {...register('confirmPassword')}
                    disabled={isLoading}
                    className="bg-white/70 dark:bg-slate-950/40"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-6 pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>

                <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}