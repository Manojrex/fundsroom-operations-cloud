# Fundsroom Operations Cloud

## Mini ERP + CRM Platform

A full-stack cloud-based ERP and CRM platform for managing customers, products, inventory, suppliers, procurement, sales challans, invoices, payments, reporting, and audit tracking.

## Live Application

Frontend:
https://fundsroom-operations-cloud.vercel.app

Backend:
https://fundsroom-operations-cloud.onrender.com

API Base URL:
https://fundsroom-operations-cloud.onrender.com/api

Postman Documentation:
ADD YOUR POSTMAN DOCUMENTATION LINK HERE

---

## Project Overview

Fundsroom Operations Cloud centralizes sales, procurement, inventory, supplier, customer, and financial workflows.

### Procurement Workflow

Purchase Order
    ->
Submitted
    ->
Approved
    ->
Partially Received
    ->
Received
    ->
Inventory Updated

### Sales Workflow

Customer
    ->
Sales Challan
    ->
Stock Validation
    ->
Confirmation
    ->
Invoice
    ->
Payment

---

## Key Features

### Authentication & Authorization

- JWT-based authentication
- Secure login
- Protected REST API routes
- Role-based access control
- Admin authorization
- Accounts authorization
- Warehouse authorization
- Automatic JWT token handling in Postman

### Customer Management

- Customer listing
- Customer details
- Customer search
- Customer operational information
- Customer transaction tracking

### Product Management

- Product catalog
- Product information
- Product pricing
- Stock information
- Product availability

### Inventory Management

- Current stock tracking
- Stock movement ledger
- Low-stock monitoring
- Inventory valuation
- Incoming stock tracking
- Outgoing stock tracking
- Negative-stock prevention

### Supplier Management

- Supplier listing
- Supplier information
- Supplier purchasing history
- Supplier relationship with purchase orders

### Purchase Orders

- Create purchase orders
- Supplier association
- Product and quantity management
- Unit pricing
- Total calculation
- Purchase order status tracking
- Approval workflow
- Goods receipt workflow

Purchase Order Lifecycle:

Create -> Submitted -> Approved -> Partially Received -> Received

### Goods Receipt

When goods are received, the system:

1. Creates a Goods Receipt Number.
2. Updates received quantities.
3. Updates product inventory.
4. Creates a stock movement.
5. Updates the purchase order status.

The system prevents receiving more units than ordered.

### Sales Challans

Sales Challans manage product dispatch to customers.

Workflow:

Draft -> Validate -> Confirm

Validation prevents dispatches that would cause negative stock.

### Invoice Management

- Invoice generation
- Invoice status
- Invoice amounts
- Customer association
- Challan association
- Payment tracking

### Payments & Receivables

- Payment tracking
- Receivables
- Invoice payment status
- Transaction history
- Outstanding amounts

### Reports & Business Intelligence

- Revenue
- Inventory value
- Low-stock products
- Pending purchase orders
- Sales activity
- Operational throughput
- System health
- Business performance

### Audit Trail

Important operations are recorded, including:

- Purchase order approval
- Goods receipt
- Inventory changes
- Sales operations
- Administrative actions

### Operations Copilot

Provides deterministic operational decision support using business and inventory information.

---

## System Architecture

User
 |
 v
React + Vite Frontend
 |
 | HTTPS / REST
 v
Node.js + Express REST API
 |
 +-------------------+
 |                   |
 v                   v
JWT + RBAC       PostgreSQL
Authentication    Database

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- HTML5
- CSS
- Responsive UI
- REST API integration

### Backend

- Node.js
- Express.js
- TypeScript
- REST API
- JWT
- Role-Based Access Control

### Database

- PostgreSQL
- pg Node.js PostgreSQL driver
- SQL transactions

### Deployment

- Vercel - Frontend
- Render - Backend
- PostgreSQL - Database

### API Development & Documentation

- Postman
- Postman Collections
- Postman Environments
- Bearer Token Authentication
- API testing
- API documentation

---

## Security Architecture

The API uses JWT authentication.

Authentication flow:

User
 ->
Login
 ->
JWT Token
 ->
Authenticated Request
 ->
JWT Verification
 ->
Role Verification
 ->
API Operation

Protected requests use:

Authorization: Bearer <JWT_TOKEN>

---

## User Roles

| Role | Responsibility |
|------|----------------|
| Admin | Full administrative access |
| Accounts | Purchase, invoice and financial operations |
| Warehouse | Inventory and goods receipt operations |

---

## REST API

Base path:

/api

Major API groups:

/api/auth
/api/customers
/api/products
/api/purchases
/api/challans
/api/suppliers
/api/invoices
/api/reports
/api/audit

---

## Authentication API

### Login

POST /api/auth/login

Example request:

{
  "email": "admin@fundsroom.local",
  "password": "YOUR_PASSWORD"
}

Example response:

{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@fundsroom.local",
    "role": "Admin"
  }
}

The token is used for protected endpoints.

---

## Purchase Order APIs

List Purchase Orders:

GET /api/purchases

Get Purchase Order:

GET /api/purchases/:id

Create Purchase Order:

POST /api/purchases

Approve Purchase Order:

POST /api/purchases/:id/approve

Receive Purchase Order:

POST /api/purchases/:id/receive

---

## Goods Receipt API

POST /api/purchases/:id/receive

Example request:

{
  "items": [
    {
      "po_item_id": 7,
      "quantity": 20
    }
  ]
}

Successful processing:

Goods Receipt Created
 ->
Inventory Increased
 ->
Stock Movement Created
 ->
Purchase Order Updated

---

## Postman API Testing

The API is tested and documented using Postman.

The collection contains requests for:

- Authentication
- Customers
- Products
- Inventory
- Suppliers
- Purchase Orders
- Goods Receipts
- Sales Challans
- Invoices
- Payments
- Reports
- Audit Trail

### Postman Environment

Variables:

baseUrl
token

Production base URL:

https://fundsroom-operations-cloud.onrender.com/api

Protected requests use:

Bearer {{token}}

### Automatic JWT Token Handling

The Login request uses a Postman post-response script:

const response = pm.response.json();

if (response.token) {
    pm.environment.set("token", response.token);
}

This automatically stores the JWT for subsequent requests.

---

## Cloud Deployment

### Frontend

Deployed on Vercel:

https://fundsroom-operations-cloud.vercel.app

Frontend environment variable:

VITE_API_URL=https://fundsroom-operations-cloud.onrender.com/api

### Backend

Deployed on Render:

https://fundsroom-operations-cloud.onrender.com

API:

https://fundsroom-operations-cloud.onrender.com/api

### Communication

Vercel Frontend
    |
    | HTTPS
    v
Render Express API
    |
    v
PostgreSQL

CORS is configured for communication between the deployed frontend and backend.

---

## Environment Variables

### Backend

backend/.env

Example:

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

For production:

DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
PORT=10000

Never commit production credentials, JWT secrets, database passwords, or private API keys.

### Frontend

frontend/.env

Local:

VITE_API_URL=http://localhost:5000/api

Production:

VITE_API_URL=https://fundsroom-operations-cloud.onrender.com/api

---

## Local Development

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Git

### Clone Repository

git clone https://github.com/Manojrex/fundsroom-operations-cloud.git

cd fundsroom-operations-cloud

### Backend

cd backend
npm install

Create .env:

DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000

Start:

npm run dev

API:

http://localhost:5000

### Frontend

Open another terminal:

cd frontend
npm install

Create .env:

VITE_API_URL=http://localhost:5000/api

Start:

npm run dev

---

## Project Structure

fundsroom-erp/
|
|-- backend/
|   |-- src/
|   |   |-- middleware/
|   |   |   `-- auth.ts
|   |   |-- routes/
|   |   |   |-- ai.ts
|   |   |   |-- audit.ts
|   |   |   |-- auth.ts
|   |   |   |-- challans.ts
|   |   |   |-- customers.ts
|   |   |   |-- dashboard.ts
|   |   |   |-- invoices.ts
|   |   |   |-- products.ts
|   |   |   |-- purchases.ts
|   |   |   |-- reports.ts
|   |   |   |-- suppliers.ts
|   |   |   `-- transfers.ts
|   |   |-- auth.ts
|   |   |-- db.ts
|   |   |-- seed.ts
|   |   `-- server.ts
|   |-- Dockerfile
|   |-- package.json
|   |-- package-lock.json
|   |-- tsconfig.json
|   `-- .env.example
|
|-- frontend/
|   |-- src/
|   |-- public/
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- tsconfig.json
|   |-- vite.config.ts
|   `-- .env.example
|
|-- docs/
|-- README.md
`-- .gitignore

---

## Core Business Workflows

### Procurement

Supplier
  ->
Purchase Order
  ->
Submitted
  ->
Approved
  ->
Goods Receipt
  ->
Inventory Increase
  ->
Stock Movement

### Sales

Customer
  ->
Sales Challan
  ->
Stock Validation
  ->
Confirmation
  ->
Invoice
  ->
Payment

### Inventory

Purchase Receipt
  ->
Stock IN
  ->
Inventory
  ->
Sales Challan
  ->
Stock OUT

---

## Transaction Safety

Critical inventory operations use database transactions.

BEGIN TRANSACTION
 |
 +-- Create Goods Receipt
 |
 +-- Update PO Item
 |
 +-- Update Product Stock
 |
 +-- Create Stock Movement
 |
COMMIT

If an operation fails:

ROLLBACK

This helps prevent partially completed inventory transactions.

---

## Negative Stock Prevention

Example:

Available Stock = 10
Requested Quantity = 15

Result:

Insufficient Stock
Transaction Rejected

The system prevents inventory from becoming negative.

---

## Dashboard

The dashboard provides an operational overview.

Metrics include:

- Revenue
- Inventory Value
- Low Stock
- Pending Purchase Orders
- Operational Throughput
- System Health

System health can include:

- API Gateway
- PostgreSQL
- Authentication

---

## Data Integrity

PostgreSQL relational data models maintain relationships between:

- Customers
- Products
- Suppliers
- Purchase Orders
- Purchase Order Items
- Goods Receipts
- Inventory
- Stock Movements
- Challans
- Invoices
- Payments
- Audit Logs
- Users

---

## API Error Handling

### 400 Bad Request

{
  "message": "Invalid request"
}

### 401 Unauthorized

{
  "message": "Unauthorized"
}

### 404 Not Found

{
  "message": "Resource not found"
}

### 500 Internal Server Error

{
  "message": "Internal server error"
}

---

## Testing Strategy

### Authentication Testing

- Valid login
- Invalid login
- JWT generation
- Protected route access
- Role-based access

### API Testing

- GET requests
- POST requests
- Validation errors
- Authorization failures
- Resource-not-found cases

### Business Logic Testing

- Purchase order approval
- Goods receipt
- Inventory updates
- Stock validation
- Negative stock prevention
- Invoice workflow

### Deployment Testing

- Vercel frontend
- Render backend
- PostgreSQL connectivity
- CORS
- Production API requests

---

## Current Project Status

### Platform

- [x] Frontend application
- [x] Backend REST API
- [x] PostgreSQL database
- [x] JWT authentication
- [x] Role-based authorization
- [x] CORS configuration
- [x] Vercel deployment
- [x] Render deployment

### ERP Modules

- [x] Authentication
- [x] Customers
- [x] Products
- [x] Inventory
- [x] Suppliers
- [x] Purchase Orders
- [x] Purchase Order Approval
- [x] Goods Receipts
- [x] Sales Challans
- [x] Invoices
- [x] Payments
- [x] Reports
- [x] Audit Trail
- [x] Operations Copilot

### API & Documentation

- [x] Postman collection
- [x] Postman environment
- [x] JWT token automation
- [x] API authentication testing
- [x] Production API testing
- [ ] Final Postman documentation publishing
- [ ] Final end-to-end demonstration

---

## Future Improvements

- Advanced analytics
- Automated notifications
- Email notifications
- Advanced role and permission management
- Barcode/QR code inventory operations
- Multi-warehouse optimization
- Advanced financial reporting
- Automated scheduled reports
- Mobile application
- Enhanced AI-assisted operational insights

---

## Project Objectives

1. Centralize business operations.
2. Improve inventory visibility.
3. Simplify procurement workflows.
4. Manage customer and supplier information.
5. Prevent inventory inconsistencies.
6. Provide secure role-based access.
7. Maintain operational auditability.
8. Provide real-time API-driven data.
9. Deploy the system using cloud infrastructure.
10. Provide documented and testable REST APIs.

---

## Highlights

- Full-Stack ERP + CRM
- React + TypeScript Frontend
- Node.js + Express Backend
- PostgreSQL Database
- JWT Authentication
- Role-Based Access Control
- REST API Architecture
- Transaction-Safe Inventory
- Procurement Workflow
- Goods Receipt Management
- Sales Challan Workflow
- Invoice & Payment Tracking
- Audit Trail
- Business Reports
- Postman API Documentation
- Vercel Deployment
- Render Deployment

---

## Author

### Manoj N

Fundsroom Operations Cloud - Mini ERP + CRM

---

## License

This project is developed for educational, demonstration, and project submission purposes.
