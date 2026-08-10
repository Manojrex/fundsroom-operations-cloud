# Local setup — beginner friendly

## 1. PostgreSQL
Create a database named `fundsroom_erp` in pgAdmin.

## 2. Backend
Open PowerShell in `backend`:

```powershell
npm install
npm run dev
```

The included `.env` is configured for the local database used during development. If your PostgreSQL password differs, edit `DATABASE_URL`.

The server automatically creates the tables and seeds demo users, customers, products, warehouses, suppliers and a purchase order.

## 3. Frontend
Open a second PowerShell in `frontend`:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo login
All demo users use `Fundsroom@123`:
- admin@fundsroom.local
- sales@fundsroom.local
- warehouse@fundsroom.local
- accounts@fundsroom.local

## Health check
Open `http://localhost:5000/api/health`.

## Demo data

The backend automatically seeds a realistic demo dataset on first startup. It includes 18 products, customers, suppliers, warehouses, stock movements, purchase orders, confirmed challans, invoices, payments, transfers and audit events. No manual SQL inserts are required.

If you already ran an older version against the same database, the new seed uses a separate marker (`fundsroom-v4-demo`) and will add the new records once when the updated backend starts.
