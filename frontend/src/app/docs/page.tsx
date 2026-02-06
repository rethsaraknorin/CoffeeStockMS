import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Documentation</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything you need to set up, run, and use Coffee Shop Stock Management.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
              Version: 1.0.0
            </span>
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-muted-foreground">
              Updated: 2026-02-06
            </span>
          </div>
        </div>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Run the project locally in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="font-medium text-foreground">Backend</div>
              <div className="rounded-md border border-border bg-background/70 p-3 font-mono text-xs">
                cd backend
                <br />
                npm install
                <br />
                npm run prisma:generate
                <br />
                npm run prisma:migrate
                <br />
                npm run dev
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">Frontend</div>
              <div className="rounded-md border border-border bg-background/70 p-3 font-mono text-xs">
                cd frontend
                <br />
                npm install
                <br />
                npm run dev
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-foreground">Environment</div>
              <div className="rounded-md border border-border bg-background/70 p-3 font-mono text-xs">
                backend/.env
                <br />
                DATABASE_URL=postgresql://user:pass@localhost:5432/stockms
                <br />
                JWT_SECRET=your-secret-key
                <br />
                PORT=5000
                <br />
                NODE_ENV=development
                <br />
                <br />
                frontend/.env.local
                <br />
                NEXT_PUBLIC_API_URL=http://localhost:5000/api
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Core Features</CardTitle>
            <CardDescription>What you can do in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>Authentication and role-based access (Admin, Staff)</div>
            <div>Products, categories, and suppliers management</div>
            <div>Stock in, out, and adjustment with history tracking</div>
            <div>Low stock alerts and quick reorder actions</div>
            <div>Reports and exports (Excel, PDF)</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Access and permissions overview</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-md border border-border bg-background/70 p-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Admin</Badge>
                <span className="text-foreground font-medium">Full access</span>
              </div>
              <div className="mt-2">Manage staff, delete entities, export reports.</div>
            </div>
            <div className="rounded-md border border-border bg-background/70 p-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Staff</Badge>
                <span className="text-foreground font-medium">Operational access</span>
              </div>
              <div className="mt-2">Manage products and stock movements.</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Inventory Flow</CardTitle>
            <CardDescription>How stock moves through the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border border-border bg-background/70 p-3">
              <div className="font-medium text-foreground">Stock In</div>
              <div>Use when new inventory arrives from suppliers.</div>
            </div>
            <div className="rounded-md border border-border bg-background/70 p-3">
              <div className="font-medium text-foreground">Stock Out</div>
              <div>Use when inventory is sold or consumed.</div>
            </div>
            <div className="rounded-md border border-border bg-background/70 p-3">
              <div className="font-medium text-foreground">Adjustment</div>
              <div>Use for manual corrections or audits.</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Reports and Exports</CardTitle>
            <CardDescription>Analytics and downloads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>Inventory value report</div>
            <div>Low stock report</div>
            <div>Stock movement report by date</div>
            <div>Excel and PDF exports</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>Common endpoints for integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>/api/auth/login, /api/auth/register, /api/auth/profile</div>
            <div>/api/products, /api/categories, /api/suppliers</div>
            <div>/api/stock/in, /api/stock/out, /api/stock/adjust</div>
            <div>/api/stock/movements, /api/stock/summary</div>
            <div>/api/reports/dashboard, /api/reports/low-stock</div>
            <div>/api/export/excel/*, /api/export/pdf/*</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>Quick fixes for common issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>Database connection errors: verify DATABASE_URL and Prisma migrations.</div>
            <div>401 errors: check JWT_SECRET and make sure you are logged in.</div>
            <div>Empty dashboard: ensure there is sample data in products and stock.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
