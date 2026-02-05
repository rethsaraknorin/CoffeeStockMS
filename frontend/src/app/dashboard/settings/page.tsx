'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Database, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from './components/ProfileSettings';
import AppearanceSettings from './components/AppearanceSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import SystemInfo from './components/SystemInfo';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Settings</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-5">
          <TabsList className="grid w-full grid-cols-2 gap-2 bg-slate-100/70 dark:bg-slate-900/50 sm:inline-flex sm:w-auto sm:grid-cols-none">
            <TabsTrigger value="profile" className="gap-2 text-xs sm:text-sm">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2 text-xs sm:text-sm">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 text-xs sm:text-sm">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 text-xs sm:text-sm">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2 text-xs sm:text-sm">
              <Info className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

        {/* Profile Tab */}
          <TabsContent value="profile" className="mt-2 sm:mt-4">
            <ProfileSettings />
          </TabsContent>

        {/* Appearance Tab */}
          <TabsContent value="appearance" className="mt-2 sm:mt-4">
            <AppearanceSettings />
          </TabsContent>

        {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-2 sm:mt-4">
            <NotificationSettings />
          </TabsContent>

        {/* Security Tab */}
          <TabsContent value="security" className="mt-2 sm:mt-4">
            <SecuritySettings />
          </TabsContent>

        {/* System Tab */}
          <TabsContent value="system" className="mt-2 sm:mt-4">
            <SystemInfo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
