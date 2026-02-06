import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const releases = [
  {
    version: '1.0.0',
    date: '2026-02-06',
    highlights: [
      'Initial release with products, stock, suppliers, categories, and reporting.',
      'Dashboard analytics with KPI cards and charts.',
      'Low stock alerts with quick reorder actions.',
    ],
  },
  {
    version: '0.9.0',
    date: '2026-01-20',
    highlights: [
      'Inventory exports to Excel and PDF.',
      'Stock movement history and activity log.',
      'Role-based access for Admin and Staff.',
    ],
  },
];

export default function ReleaseNotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Release Notes</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track new features, improvements, and fixes.
          </p>
        </div>

        <div className="space-y-4">
          {releases.map((release) => (
            <Card key={release.version} className="border-border/60 bg-background/70 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Version {release.version}</CardTitle>
                  <Badge variant="outline">{release.date}</Badge>
                </div>
                <CardDescription>Highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {release.highlights.map((item, index) => (
                  <div key={index}>- {item}</div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
