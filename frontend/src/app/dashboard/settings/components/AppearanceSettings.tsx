
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { toast } from 'sonner';

export default function AppearanceSettings() {
  const [theme, setTheme] = useState('light');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedCompact = localStorage.getItem('compact') === 'true';
    const savedAnimations = localStorage.getItem('animations') !== 'false';
    
    setTheme(savedTheme);
    setCompactMode(savedCompact);
    setAnimations(savedAnimations);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleCompactModeChange = (checked: boolean) => {
    setCompactMode(checked);
    localStorage.setItem('compact', checked.toString());
    toast.success(checked ? 'Compact mode enabled' : 'Compact mode disabled');
  };

  const handleAnimationsChange = (checked: boolean) => {
    setAnimations(checked);
    localStorage.setItem('animations', checked.toString());
    toast.success(checked ? 'Animations enabled' : 'Animations disabled');
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose your preferred color theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={theme} onValueChange={handleThemeChange}>
            <div className="grid grid-cols-3 gap-4">
              {/* Light Theme */}
              <div>
                <RadioGroupItem
                  value="light"
                  id="light"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Sun className="mb-3 h-6 w-6" />
                  <span className="font-medium">Light</span>
                </Label>
              </div>

              {/* Dark Theme */}
              <div>
                <RadioGroupItem
                  value="dark"
                  id="dark"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Moon className="mb-3 h-6 w-6" />
                  <span className="font-medium">Dark</span>
                </Label>
              </div>

              {/* System Theme */}
              <div>
                <RadioGroupItem
                  value="system"
                  id="system"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Monitor className="mb-3 h-6 w-6" />
                  <span className="font-medium">System</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>
            Customize how content is displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Reduce spacing for more content on screen
              </p>
            </div>
            <Switch
              id="compact"
              checked={compactMode}
              onCheckedChange={handleCompactModeChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable smooth transitions and animations
              </p>
            </div>
            <Switch
              id="animations"
              checked={animations}
              onCheckedChange={handleAnimationsChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
