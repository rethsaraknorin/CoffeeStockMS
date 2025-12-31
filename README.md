# Coffee Stock Management System

A full-stack stock management system built for managing coffee inventory, products, suppliers, and stock movements with real-time reporting and notifications.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Export**: ExcelJS, PDFKit
- **Email**: Nodemailer

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Notifications**: Sonner

## 📁 Project Structure

```
StockMS/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & error handling
│   │   ├── validations/    # Request validation
│   │   ├── utils/          # Utilities (JWT, bcrypt)
│   │   └── types/          # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── package.json
│
└── frontend/               # Next.js application
    ├── src/
    │   ├── app/            # Next.js app router pages
    │   │   ├── (auth)/     # Authentication pages
    │   │   └── dashboard/  # Dashboard pages
    │   ├── components/     # React components
    │   ├── lib/            # Utilities & API client
    │   ├── store/          # Zustand stores
    │   └── types/          # TypeScript types
    └── package.json
```

## ✨ Features

- 🔐 **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin/Staff)

- 📦 **Product Management**
  - Create, read, update, and delete products
  - Product categorization
  - SKU management
  - Unit price tracking

- 📊 **Stock Management**
  - Stock in/out operations
  - Stock adjustments
  - Stock movement history
  - Low stock alerts
  - Reorder level management

- 🏢 **Supplier Management**
  - Supplier CRUD operations
  - Contact information management
  - Supplier-product relationships

- 📈 **Reports & Analytics**
  - Inventory value reports
  - Stock movement charts
  - Category performance analysis
  - Export to Excel/PDF

- 🔔 **Notifications**
  - Low stock alerts
  - System notifications
  - Email notifications

- ⚙️ **Settings**
  - User profile management
  - Appearance settings
  - Security settings
  - Notification preferences

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the `backend` directory with the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/stockms?schema=public"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

4. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The backend API will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will be running on `http://localhost:3000`

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and user management
- **Product**: Product information and inventory
- **Category**: Product categories
- **Supplier**: Supplier information
- **StockMovement**: Stock transaction history

See `backend/prisma/schema.prisma` for the complete schema definition.

## 🚦 Development Workflow

1. **Start the database**: Ensure PostgreSQL is running
2. **Start the backend**: `cd backend && npm run dev`
3. **Start the frontend**: `cd frontend && npm run dev`
4. **Access the application**: Open `http://localhost:3000` in your browser

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes with middleware
- Input validation with Zod
- CORS configuration
- Environment variable management

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue in the repository.

