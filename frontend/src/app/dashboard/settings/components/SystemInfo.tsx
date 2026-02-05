'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coffee, Database, Server, Code, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SystemInfo() {
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

      {/* Tech Stack */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>
            Technologies powering this application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Frontend</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Next.js 14</Badge>
                <Badge variant="outline">React 18</Badge>
                <Badge variant="outline">TypeScript</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Backend</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Express.js</Badge>
                <Badge variant="outline">Node.js</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Database</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">PostgreSQL</Badge>
                <Badge variant="outline">Prisma ORM</Badge>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">UI Framework</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Shadcn/ui</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Links</CardTitle>
          <CardDescription>
            Useful documentation and support links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-between">
            Documentation
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Support Center
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Report an Issue
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Release Notes
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Built with ❤️ for coffee shop inventory management</p>
        <p className="mt-1">© 2026 Coffee Shop Stock Manager. All rights reserved.</p>
      </div>
    </div>
  );
}