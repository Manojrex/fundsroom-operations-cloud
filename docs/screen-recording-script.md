# Fundsroom 4–6 minute screen-recording flow

1. Login as Admin.
2. Show Command Center: revenue, inventory value, low-stock alerts and pending purchase orders.
3. Open Customers: search a customer and show CRM fields/follow-up date.
4. Open Products / Inventory: show low-stock item and warehouse coverage.
5. Open Procurement: show seeded PO-2026-DEMO → Approved → receive goods. Explain that Goods Receipt increases product stock and writes an IN movement.
6. Open Challans: create a draft for a customer, add two products, confirm it, and show the zero-negative-stock rule.
7. Generate an invoice directly from the confirmed challan.
8. Open Invoices: record a payment and show the balance/status update.
9. Open Reports: show gross invoiced value, receivables, top products and restock queue.
10. Open Audit Trail: show that critical actions are recorded.
11. Open AI Copilot: ask “Which products need restocking?” and show the deterministic live-data insight.
12. Briefly show Suppliers and Inventory transfer/register screens.
13. Open GitHub repository and README.

Recommended narration: “The core design is transaction-safe: confirming a sales challan locks the relevant product rows, validates stock, decrements inventory and records an OUT movement in the same database transaction. Procurement follows the reverse flow through approved purchase orders and goods receipts.”
