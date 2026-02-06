import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function IssuesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Report an Issue</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Found a bug or request? Share the details so we can fix it quickly.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
              Typical response: 24-48 hours
            </span>
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
              Priority: Based on impact
            </span>
          </div>
        </div>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>Help us reproduce the problem</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="issueTitle">
                Title
              </label>
              <Input id="issueTitle" placeholder="Stock out button not working" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="issueEmail">
                Contact Email
              </label>
              <Input id="issueEmail" type="email" placeholder="you@example.com" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="issuePage">
                  Page / Area
                </label>
                <Input id="issuePage" placeholder="Stock Management" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="issueSeverity">
                  Severity
                </label>
                <Input id="issueSeverity" placeholder="Low / Medium / High" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="issueSteps">
                Steps to Reproduce
              </label>
              <Textarea id="issueSteps" placeholder="1. Go to stock page... 2. Click..." rows={4} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="issueExpected">
                Expected vs Actual
              </label>
              <Textarea id="issueExpected" placeholder="Expected: ... Actual: ..." rows={4} />
            </div>
            <Button className="w-full" disabled>
              Submit Issue (Coming Soon)
            </Button>
            <p className="text-xs text-muted-foreground">
              Use this form to capture details. You can later route it to a ticketing system.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Tips for Faster Fixes</CardTitle>
            <CardDescription>Include the details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>
              <Badge variant="outline">Browser</Badge>
              <span className="ml-2">Chrome, Edge, Safari, or Firefox</span>
            </div>
            <div>
              <Badge variant="outline">User Role</Badge>
              <span className="ml-2">Admin or Staff</span>
            </div>
            <div>
              <Badge variant="outline">Time</Badge>
              <span className="ml-2">When it occurred</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
