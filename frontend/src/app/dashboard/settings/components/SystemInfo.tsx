'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coffee, ExternalLink, BookOpen, LifeBuoy, Bug, Megaphone } from 'lucide-react';

export default function SystemInfo() {
  const resources = [
    {
      title: 'Documentation',
      description: 'Setup guides, usage, and API references',
      href: '/docs',
      icon: BookOpen
    },
    {
      title: 'Support Center',
      description: 'Get help and contact support',
      href: '/support',
      icon: LifeBuoy
    },
    {
      title: 'Report an Issue',
      description: 'Submit bugs or feature requests',
      href: '/issues',
      icon: Bug
    },
    {
      title: 'Release Notes',
      description: 'See what changed in each version',
      href: '/releases',
      icon: Megaphone
    }
  ];

  return (
    <div className="space-y-6">
      {/* Application Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Application Information
          </CardTitle>
          <CardDescription>
            System details and version information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Application Name</p>
              <p className="font-medium">Coffee Shop Stock Manager</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Version</p>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Environment</p>
              <Badge>Production</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Links</CardTitle>
          <CardDescription>
            Useful documentation and support links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {resources.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant="outline"
                className="w-full justify-between p-0"
                asChild
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-between px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-left">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </span>
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Built with care for coffee shop inventory management</p>
        <p className="mt-1">(c) 2026 Reth Saraknorin. All rights reserved.</p>
      </div>
    </div>
  );
}
