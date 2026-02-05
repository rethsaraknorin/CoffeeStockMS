'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { toast } from 'sonner';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { user, updateUser, setAuth, token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', data);
      const updatedUser = response.data?.data?.user;
      const newToken = response.data?.data?.token;

      if (updatedUser) {
        if (newToken) {
          setAuth(updatedUser, newToken);
        } else if (token) {
          setAuth(updatedUser, token);
        } else {
          updateUser(updatedUser);
        }
        reset({
          username: updatedUser.username,
          email: updatedUser.email,
        });
      }
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user?.username}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="outline" className="mt-2">{user?.role}</Badge>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Your account information and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Created</p>
              <p className="font-medium">{new Date(user?.createdAt || '').toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{user?.id.substring(0, 8)}...</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge>{user?.role}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
