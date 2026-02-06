# Coffee Stock Management System

Inventory management for coffee shops with product, supplier, stock, and reporting workflows in one place.

## Project Structure

```
StockMS/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth and error handling
│   │   ├── validations/   # Request validation
│   │   ├── utils/         # Shared helpers
│   │   └── types/         # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── migrations/    # Database migrations
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/           # App router pages
    │   │   ├── (auth)/    # Auth pages
    │   │   ├── dashboard/ # Main app pages
    │   │   └── docs/      # Documentation page
    │   ├── components/    # UI and feature components
    │   ├── lib/           # API client and helpers
    │   ├── store/         # Client state
    │   └── types/         # Shared types
    └── package.json
```

## Features

1. Authentication and role-based access (Admin, Staff)
2. Products, categories, and suppliers management
3. Stock in, out, and adjustment flows with history tracking
4. Low stock alerts with quick reorder actions
5. Reports, exports, and analytics dashboard
6. Staff management with activity history
7. Settings area with documentation and support pages

## App Pages

1. Dashboard overview with KPIs, charts, and recent activity
2. Products management with search, filters, and pagination
3. Stock management with quick actions and history
4. Suppliers and categories management
5. Reports and exports
6. Staff management with roles and activity history
7. Docs, Support Center, Issues, Release Notes

## Setup

1. Backend
```
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

2. Frontend
```
cd frontend
npm install
npm run dev
```

3. Environment
```
backend/.env
DATABASE_URL=postgresql://user:pass@localhost:5432/stockms
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development

frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Suggested Additions

1. Role-based audit log for all critical actions (not just stock)
2. Server-side pagination for large datasets where still client-side
3. Email or webhook notifications for low stock and reorder events
4. Saved filters and custom report presets
5. Import tools for bulk product and supplier setup

## Suggested Removals or Simplifications

1. Reduce duplicate UI patterns by centralizing shared status logic
2. Limit client-side filtering for heavy lists when server-side exists
3. Consolidate repeated dialog styles into shared components

## License

ISC
