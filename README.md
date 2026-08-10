# Fundsroom Operations Cloud — Mini ERP + CRM

A premium full-stack interview case-study implementation for the Fundsroom Mini ERP + CRM brief.

## Stack
- React + TypeScript + Vite
- Node.js + TypeScript + Express
- PostgreSQL + `pg`
- JWT authentication and role-based access
- REST APIs
- Responsive admin-style UI

## Core workflows
- JWT login with Admin, Sales, Warehouse and Accounts roles
- Customer CRM with search, status and follow-up fields
- Product catalog and inventory intelligence
- Stock movement ledger
- Sales challans with product snapshots
- Transaction-safe confirmation that prevents negative stock
- Suppliers and supplier purchasing history
- Purchase orders: Submitted → Approved → Partially Received → Received
- Goods receipts automatically increase inventory and create IN movements
- Invoices generated from confirmed challans
- Payment tracking and receivables
- Multi-warehouse view and stock transfers
- Reports / business intelligence
- Audit trail
- Operations Copilot (deterministic decision-support endpoint over current ERP data)
- Command palette (Ctrl/Cmd K), responsive layout, animated dashboard, GIF login visual

## Demo credentials
All roles use:
`Fundsroom@123`

- admin@fundsroom.local
- sales@fundsroom.local
- warehouse@fundsroom.local
- accounts@fundsroom.local

## Local setup
1. Create a PostgreSQL database named `fundsroom_erp`.
2. In `backend/.env`, set `DATABASE_URL`, `JWT_SECRET`, `PORT=5000`, and `CORS_ORIGIN=http://localhost:5173`.
3. Run:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
   The API initializes tables and seeds safe demo data automatically.
4. In another terminal:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
5. Open `http://localhost:5173`.

## Production notes
- Never commit `.env` files.
- Use a separate production database/password.
- Configure `VITE_API_URL` to the deployed backend URL.
- AWS is optional for the assignment; Vercel/Netlify + Render/Railway + Neon/Supabase are suitable free-tier deployment options.

## Architecture
`React → REST API → Express/TypeScript → PostgreSQL`

Business-critical inventory mutations use PostgreSQL transactions and row locks. Challan confirmation, goods receipt and stock transfer therefore preserve inventory consistency.
