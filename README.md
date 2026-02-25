# Strader Agent

Business process automation system for wholesale company (cable support systems, electrical equipment).

## Tech Stack

- **Frontend**: React (Vite, TypeScript, Tailwind CSS, shadcn/ui)
- **Backend**: Express.js (TypeScript)
- **Database**: PostgreSQL (Drizzle ORM)
- **Deployment**: Railway

## Features

### 1. Zákaznícky Agent (Customer Agent)
- Email inbox with AI analysis
- Automatic action suggestions
- Customer and sales rep assignment
- Real-time email processing

### 2. Fakturačný Agent (Invoice Agent)
- Invoice generation from delivery notes
- Payment tracking (Revolut integration ready)
- Incoming invoice verification
- Automatic reminders for overdue invoices

### 3. Produktový Agent (Product Agent)
- Fast product search and filtering
- Composite product templates
- Stock management
- AI material assistant

### 4. Prehľady (Dashboards)
- Real-time metrics and KPIs
- Revenue charts and analytics
- Sales rep performance tracking
- Pipeline visualization

## Development

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Setup

1. Install dependencies:
```bash
npm install
cd client && npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

3. Setup database:
```bash
npm run db:push
npm run db:seed
```

4. Run development server:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Production Build

```bash
npm run build
npm start
```

## Railway Deployment

1. Create new project in Railway
2. Connect GitHub repository
3. Add PostgreSQL database
4. Set environment variable: `DATABASE_URL`
5. Deploy!

Railway will automatically detect nixpacks.toml and build the application.

## Project Structure

```
/
├── client/          React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     Sidebar, Layout
│   │   │   ├── customer/   Customer Agent
│   │   │   ├── invoice/    Invoice Agent
│   │   │   ├── product/    Product Agent
│   │   │   └── dashboard/  Dashboards
│   │   ├── lib/            Utilities, API client
│   │   └── App.tsx
├── server/          Express backend
│   ├── index.ts     Server entry
│   ├── routes.ts    API routes
│   ├── schema.ts    Database schema
│   ├── db.ts        Database connection
│   └── seed.ts      Seed data
└── drizzle/         Database migrations
```

## License

Proprietary - Strader © 2024
