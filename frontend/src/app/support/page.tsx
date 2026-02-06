import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Support Center</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Get help with setup, inventory workflows, and account access.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
              Response time: 24-48 hours
            </span>
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
              Availability: Mon-Fri
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/60 bg-background/70 backdrop-blur">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Tell us what you need help with</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="supportSubject">
                  Subject
                </label>
                <Input id="supportSubject" placeholder="Issue with stock adjustment" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="supportEmail">
                  Email
                </label>
                <Input id="supportEmail" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="supportMessage">
                  Message
                </label>
                <Textarea id="supportMessage" placeholder="Describe the issue..." rows={5} />
              </div>
              <Button className="w-full" disabled>
                Submit Request (Coming Soon)
              </Button>
              <p className="text-xs text-muted-foreground">
                For now, contact your admin or help desk to submit a support ticket.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
                <CardDescription>Common issues and fixes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <Badge variant="outline">Login</Badge>
                  <span className="ml-2">Check your email/password and try again.</span>
                </div>
                <div>
                  <Badge variant="outline">Stock</Badge>
                  <span className="ml-2">Verify product exists before stock movements.</span>
                </div>
                <div>
                  <Badge variant="outline">Reports</Badge>
                  <span className="ml-2">Ensure date range is selected for exports.</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>System availability</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                All services operational. If you notice outages, notify your admin.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
