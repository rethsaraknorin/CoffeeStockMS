'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    lowStockEmail: true,
    dailySummary: false,
    stockMovements: true,
    systemUpdates: true,
    emailAddress: '',
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    toast.success('Notification settings updated');
  };

  const handleEmailChange = (email: string) => {
    const newSettings = { ...settings, emailAddress: email };
    setSettings(newSettings);
  };

  const handleSaveEmail = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast.success('Email address saved');
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Notification Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="notifications@example.com"
                value={settings.emailAddress}
                onChange={(e) => handleEmailChange(e.target.value)}
              />
              <Button onClick={handleSaveEmail}>Save</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Email address where notifications will be sent
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when products are running low
                </p>
              </div>
              <Switch
                checked={settings.lowStockEmail}
                onCheckedChange={() => handleToggle('lowStockEmail')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Summary</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily inventory summary emails
                </p>
              </div>
              <Switch
                checked={settings.dailySummary}
                onCheckedChange={() => handleToggle('dailySummary')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Stock Movements</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications for stock IN/OUT operations
                </p>
              </div>
              <Switch
                checked={settings.stockMovements}
                onCheckedChange={() => handleToggle('stockMovements')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Important system updates and announcements
                </p>
              </div>
              <Switch
                checked={settings.systemUpdates}
                onCheckedChange={() => handleToggle('systemUpdates')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>
            Control how often you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                Instant
              </Button>
              <Button variant="outline" className="w-full">
                Daily
              </Button>
              <Button variant="outline" className="w-full">
                Weekly
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose how often you want to receive digest emails
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}