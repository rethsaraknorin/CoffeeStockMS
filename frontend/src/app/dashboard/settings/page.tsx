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
    <div className="flex-1 space-y-4 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Info className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system">
          <SystemInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}