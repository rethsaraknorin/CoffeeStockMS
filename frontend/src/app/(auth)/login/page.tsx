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

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const response = await api.post<AuthResponse>('/auth/login', data);

            if (response.data.success) {
                const { user, token } = response.data.data;

                // Save auth
                setAuth(user, token);

                // Show success
                toast.success('Login successful!');

                // Hard redirect (not using Next.js router)
                window.location.href = '/dashboard';
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
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
                                    Coffee Shop Stock Manager
                                </h1>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    Track inventory, spot low stock, and keep orders flowing.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <div className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-slate-900/60">
                                Live stock overview and alerts
                            </div>
                            <div className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-slate-900/60">
                                Fast adjustments and audit trail
                            </div>
                            <div className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-slate-900/60">
                                Clean reports for export
                            </div>
                        </div>
                    </div>

                    <Card className="w-full border-slate-200/70 bg-white/80 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/80 animate-in slide-in-from-right-6 fade-in duration-700">
                        <CardHeader className="space-y-2">
                            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                            <CardDescription>
                                Sign in to your Coffee Shop Stock Management account
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6 pb-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email"
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
                            </CardContent>

                        <CardFooter className="flex flex-col space-y-6 pt-2">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                                    window.location.href = `${apiUrl}/auth/google`;
                                }}
                            >
                                Continue with Google
                            </Button>

                            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="text-blue-600 hover:underline">
                                    Sign up
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
