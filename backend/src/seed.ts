import { query } from './db';
import { hashPassword } from './auth';

/**
 * Idempotent demo-data seed for the Fundsroom interview case study.
 * It intentionally creates realistic operational data so the dashboard,
 * inventory, CRM, procurement and finance screens are populated on first run.
 */
export async function seedDemoData() {
  await query(`CREATE TABLE IF NOT EXISTS demo_seed_runs(key VARCHAR(80) PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW())`);
  // The seed is idempotent: re-run it on every startup so an existing database
  // that was seeded incompletely can self-heal. Individual records use conflict/existence checks.

  const passwordHash = await hashPassword('Fundsroom@123');

  const users = [
    ['Admin User', 'admin@fundsroom.local', 'Admin'],
    ['Sales User', 'sales@fundsroom.local', 'Sales'],
    ['Warehouse User', 'warehouse@fundsroom.local', 'Warehouse'],
    ['Accounts User', 'accounts@fundsroom.local', 'Accounts'],
  ];
  for (const u of users) {
    await query(
      `INSERT INTO users(name,email,password_hash,role) VALUES($1::varchar,$2::varchar,$3::text,$4::varchar)
       ON CONFLICT(email) DO NOTHING`,
      [u[0], u[1], passwordHash, u[2]],
    );
  }

  const admin = (await query<{ id: number }>(`SELECT id FROM users WHERE email='admin@fundsroom.local' LIMIT 1`)).rows[0].id;
  const sales = (await query<{ id: number }>(`SELECT id FROM users WHERE email='sales@fundsroom.local'`)).rows[0].id;
  const warehouseUser = (await query<{ id: number }>(`SELECT id FROM users WHERE email='warehouse@fundsroom.local'`)).rows[0].id;

  const warehouses = [
    ['Bangalore Central Warehouse', 'Peenya, Bengaluru, Karnataka', 'Ravi Kumar'],
    ['Doddaballapur Main Warehouse', 'Doddaballapur, Karnataka', 'Manoj Shetty'],
    ['Mysore Distribution Hub', 'Hebbal Industrial Area, Mysore', 'Anil Rao'],
    ['Chennai Regional Hub', 'Ambattur, Chennai, Tamil Nadu', 'Priya Nair'],
  ];
  for (const w of warehouses) {
    await query(`INSERT INTO warehouses(name,location,manager) VALUES($1::varchar,$2::varchar,$3::varchar) ON CONFLICT(name) DO NOTHING`, w);
  }

  const customers = [
    ['Bangalore Electronics', '9876543210', 'ops@bangaloreelectronics.in', 'Bangalore Electronics Pvt Ltd', '29ABCDE1234F1Z5', 'Wholesale', 'Peenya, Bengaluru, Karnataka', 'Active', '2026-08-14', 'Priority wholesale account'],
    ['Mysore Distributors', '9845123456', 'sales@mysoredist.in', 'Mysore Distributors', '29PQRSX5678G1Z2', 'Distributor', 'Mysore, Karnataka', 'Active', '2026-08-15', 'Monthly replenishment'],
    ['Karnataka Retail Mart', '9988776655', 'contact@krmart.in', 'Karnataka Retail Mart', null, 'Retail', 'Doddaballapur, Karnataka', 'Lead', '2026-08-18', 'New retail prospect'],
    ['TechNova Solutions', '9123456780', 'procurement@technova.in', 'TechNova Solutions Pvt Ltd', '29TECHN9000T1Z9', 'Wholesale', 'Whitefield, Bengaluru', 'Active', '2026-08-12', 'Enterprise IT buyer'],
    ['City Office Systems', '9012345678', 'orders@cityoffice.in', 'City Office Systems', '29OFFIC1234O1Z4', 'Distributor', 'Rajajinagar, Bengaluru', 'Active', '2026-08-20', 'Office equipment partner'],
    ['Mangaluru Smart Store', '8899776655', 'hello@mangalurustore.in', 'Mangaluru Smart Store', '29SMART5555S1Z6', 'Retail', 'Mangaluru, Karnataka', 'Active', '2026-08-21', 'Fast-growing retail account'],
    ['Hubli Business Mart', '8877665544', 'sales@hubbusiness.in', 'Hubli Business Mart', null, 'Wholesale', 'Hubballi, Karnataka', 'Active', '2026-08-22', 'Regional wholesale buyer'],
    ['Tumakuru IT Hub', '8866554433', 'purchase@tumakuruithub.in', 'Tumakuru IT Hub', '29TUMAK7777T1Z8', 'Retail', 'Tumakuru, Karnataka', 'Lead', '2026-08-25', 'New account under qualification'],
  ];
  for (const c of customers) {
    await query(
      `INSERT INTO customers(name,mobile,email,business_name,gst_number,customer_type,address,status,follow_up_date,notes)
       SELECT $1::varchar,$2::varchar,$3::varchar,$4::varchar,$5::varchar,$6::varchar,$7::text,$8::varchar,$9::date,$10::text
       WHERE NOT EXISTS(SELECT 1 FROM customers WHERE mobile=$2::varchar)`,
      c,
    );
  }

  // Rich product catalogue. Stock deliberately includes healthy, low-stock and critical items.
  const products = [
    ['TP-Link Archer AX23 Wi-Fi 6 Router', 'TPL-AX23', 'Networking', 4299, 48, 10, 'Bangalore Central Warehouse'],
    ['Ubiquiti UniFi U6 Lite Access Point', 'UBQ-U6L', 'Networking', 11999, 7, 10, 'Bangalore Central Warehouse'],
    ['Cisco CBS250 24-Port Switch', 'CIS-CBS250', 'Networking', 18499, 22, 8, 'Doddaballapur Main Warehouse'],
    ['Logitech MK270 Wireless Keyboard Mouse', 'LOG-MK270', 'Peripherals', 1899, 75, 15, 'Bangalore Central Warehouse'],
    ['Dell KM5221W Keyboard Mouse', 'DEL-KM5221', 'Peripherals', 2499, 32, 10, 'Mysore Distribution Hub'],
    ['HP LaserJet Pro MFP 4103fdw', 'HP-MFP-4103', 'Printers', 28999, 8, 5, 'Doddaballapur Main Warehouse'],
    ['Canon PIXMA G3770 Ink Tank Printer', 'CAN-G3770', 'Printers', 16999, 13, 8, 'Mysore Distribution Hub'],
    ['Dell Latitude 5440 Business Laptop', 'DELL-L5440', 'Laptops', 68500, 14, 5, 'Doddaballapur Main Warehouse'],
    ['Lenovo ThinkPad E14 Gen 5', 'LEN-E14G5', 'Laptops', 72900, 9, 4, 'Bangalore Central Warehouse'],
    ['Samsung 24-inch F24T350 Monitor', 'SAM-F24T', 'Displays', 11999, 6, 8, 'Bangalore Central Warehouse'],
    ['LG 27-inch UltraGear Monitor', 'LG-27GN', 'Displays', 23999, 18, 6, 'Chennai Regional Hub'],
    ['APC Back-UPS 1100VA', 'APC-BX1100', 'Power', 8499, 26, 8, 'Doddaballapur Main Warehouse'],
    ['Kingston 1TB NVMe SSD', 'KNG-NV1TB', 'Storage', 6999, 4, 10, 'Mysore Distribution Hub'],
    ['WD 2TB Portable External HDD', 'WD-EXT2TB', 'Storage', 5899, 17, 7, 'Bangalore Central Warehouse'],
    ['JBL Professional Business Speaker', 'JBL-BIZ100', 'Audio', 6499, 11, 5, 'Chennai Regional Hub'],
    ['Zebra ZD220 Barcode Printer', 'ZBR-ZD220', 'Warehouse', 12999, 5, 4, 'Doddaballapur Main Warehouse'],
    ['Honeywell 1450G Barcode Scanner', 'HNW-1450G', 'Warehouse', 7399, 3, 6, 'Doddaballapur Main Warehouse'],
    ['Epson EB-E01 Projector', 'EPS-EBE01', 'Presentation', 36999, 10, 3, 'Bangalore Central Warehouse'],
  ];
  for (const p of products) {
    await query(
      `INSERT INTO products(name,sku,category,unit_price,current_stock,min_stock,warehouse)
       VALUES($1::varchar,$2::varchar,$3::varchar,$4::numeric,$5::integer,$6::integer,$7::varchar)
       ON CONFLICT(sku) DO NOTHING`,
      p,
    );
  }

  // Opening stock movements for products that have no movement history yet.
  const productRows = await query<{ id: number; sku: string; current_stock: number }>(
    `SELECT id,sku,current_stock FROM products WHERE sku = ANY($1::text[])`,
    [products.map(p => p[1])],
  );
  for (const p of productRows.rows) {
    const exists = await query(`SELECT 1 FROM stock_movements WHERE product_id=$1 LIMIT 1`, [p.id]);
    if (!exists.rowCount) {
      await query(
        `INSERT INTO stock_movements(product_id,quantity,movement_type,reason,created_by) VALUES($1::integer,$2::integer,'IN',$3::text,$4::integer)`,
        [p.id, p.current_stock, 'Opening inventory', warehouseUser],
      );
    }
  }

  const suppliers = [
    ['ABC Technologies', '9876543210', 'sales@abctech.in', '29ABCDE1111A1Z1', 'Bangalore, Karnataka', 'Active'],
    ['Global Electronics', '9845123456', 'orders@globalelec.in', '29ABCDE2222B1Z2', 'Chennai, Tamil Nadu', 'Active'],
    ['Tech Distributors', '9988776655', 'po@techdist.in', '29ABCDE3333C1Z3', 'Mysore, Karnataka', 'Active'],
    ['Network World India', '9123456789', 'sales@networkworld.in', '29ABCDE4444D1Z4', 'Hyderabad, Telangana', 'Active'],
    ['OfficeTech Supplies', '9011223344', 'orders@officetech.in', '29ABCDE5555E1Z5', 'Pune, Maharashtra', 'Active'],
    ['Prime IT Wholesale', '8899001122', 'purchase@primeit.in', '29ABCDE6666F1Z6', 'Chennai, Tamil Nadu', 'On Hold'],
  ];
  for (const s of suppliers) {
    await query(
      `INSERT INTO suppliers(name,contact,email,gst_number,address,status)
       SELECT $1::varchar,$2::varchar,$3::varchar,$4::varchar,$5::text,$6::varchar
       WHERE NOT EXISTS(SELECT 1 FROM suppliers WHERE name=$1::varchar)`,
      s,
    );
  }

  const supplier = (await query<{ id: number }>(`SELECT id FROM suppliers WHERE name='ABC Technologies' LIMIT 1`)).rows[0].id;
  const router = (await query<{ id: number; name: string; unit_price: number }>(`SELECT id,name,unit_price FROM products WHERE sku='TPL-AX23' LIMIT 1`)).rows[0];
  const monitor = (await query<{ id: number; name: string; unit_price: number }>(`SELECT id,name,unit_price FROM products WHERE sku='SAM-F24T' LIMIT 1`)).rows[0];
  const scanner = (await query<{ id: number; name: string; unit_price: number }>(`SELECT id,name,unit_price FROM products WHERE sku='HNW-1450G' LIMIT 1`)).rows[0];
  const customer = (await query<{ id: number }>(`SELECT id FROM customers WHERE mobile='9876543210' LIMIT 1`)).rows[0].id;
  const customer2 = (await query<{ id: number }>(`SELECT id FROM customers WHERE mobile='9123456780' LIMIT 1`)).rows[0].id;

  // Procurement records.
  const poDefs = [
    ['PO-2026-1001', supplier, 'Approved', router, 50, 20],
    ['PO-2026-1002', supplier, 'Partially Received', monitor, 25, 15],
    ['PO-2026-1003', supplier, 'Submitted', scanner, 30, 0],
  ] as const;
  for (const [poNumber, supplierId, status, product, qty, received] of poDefs) {
    const exists = await query(`SELECT id FROM purchase_orders WHERE po_number=$1::varchar`, [poNumber]);
    if (!exists.rowCount) {
      const po = await query<{ id: number }>(
        `INSERT INTO purchase_orders(po_number,supplier_id,status,total,created_by) VALUES($1::varchar,$2::integer,$3::varchar,$4::numeric,$5::integer) RETURNING id`,
        [poNumber, supplierId, status, Number(product.unit_price) * qty * 1.18, admin],
      );
      await query(
        `INSERT INTO purchase_order_items(po_id,product_id,product_name,quantity,received_quantity,unit_price) VALUES($1::integer,$2::integer,$3::varchar,$4::integer,$5::integer,$6::numeric)`,
        [po.rows[0].id, product.id, product.name, qty, received, product.unit_price],
      );
    }
  }

  // Confirmed sales challans + invoices provide meaningful revenue and stock history.
  const salesDefs = [
    ['SC-2026-DEMO-001', customer, router, 4],
    ['SC-2026-DEMO-002', customer2, monitor, 2],
    ['SC-2026-DEMO-003', customer, scanner, 1],
  ] as const;
  for (const [number, customerId, product, qty] of salesDefs) {
    const exists = await query<{ id: number }>(`SELECT id FROM challans WHERE challan_number=$1::varchar`, [number]);
    if (exists.rowCount) continue;
    const challan = await query<{ id: number }>(
      `INSERT INTO challans(challan_number,customer_id,total_quantity,status,created_by) VALUES($1::varchar,$2::integer,$3::integer,'Confirmed',$4::integer) RETURNING id`,
      [number, customerId, qty, sales],
    );
    await query(
      `INSERT INTO challan_items(challan_id,product_id,product_name,sku,unit_price,quantity) VALUES($1::integer,$2::integer,$3::varchar,(SELECT sku FROM products WHERE id=$2::integer),$4::numeric,$5::integer)`,
      [challan.rows[0].id, product.id, product.name, product.unit_price, qty],
    );
    // Deduct stock exactly once for the demo challan.
    await query(`UPDATE products SET current_stock=GREATEST(0,current_stock-$1) WHERE id=$2`, [qty, product.id]);
    await query(
      `INSERT INTO stock_movements(product_id,quantity,movement_type,reason,created_by) VALUES($1::integer,$2::integer,'OUT',$3::text,$4::integer)`,
      [product.id, qty, `Sales Challan ${number}`, sales],
    );
    await query(
      `INSERT INTO audit_logs(user_id,action,entity,entity_id,details) VALUES($1::integer,'Confirmed sales challan','Challan',$2::varchar,$3::text)`,
      [sales, String(challan.rows[0].id), number],
    );

    const subtotal = Number(product.unit_price) * qty;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    const invoiceNumber = number.replace('SC-', 'INV-');
    const invoice = await query<{ id: number }>(
      `INSERT INTO invoices(invoice_number,challan_id,customer_id,subtotal,tax,total,status) VALUES($1::varchar,$2::integer,$3::integer,$4::numeric,$5::numeric,$6::numeric,$7::varchar) RETURNING id`,
      [invoiceNumber, challan.rows[0].id, customerId, subtotal, tax, total, number.endsWith('001') ? 'Paid' : 'Partially Paid'],
    );
    await query(
      `INSERT INTO invoice_items(invoice_id,product_id,product_name,quantity,unit_price) VALUES($1::integer,$2::integer,$3::varchar,$4::integer,$5::numeric)`,
      [invoice.rows[0].id, product.id, product.name, qty, product.unit_price],
    );
    const paid = number.endsWith('001') ? total : Math.round(total * 0.45);
    await query(
      `INSERT INTO payments(invoice_id,amount,method,reference,created_by) VALUES($1::integer,$2::numeric,$3::varchar,$4::varchar,$5::integer)`,
      [invoice.rows[0].id, paid, number.endsWith('001') ? 'Bank Transfer' : 'UPI', `DEMO-${number.slice(-3)}`, admin],
    );
  }

  // Draft / in-transit transfers for the inventory page.
  const transferDefs = [
    ['TR-2026-1001', 'Bangalore Central Warehouse', 'Mysore Distribution Hub', router.id, 6, 'Completed'],
    ['TR-2026-1002', 'Doddaballapur Main Warehouse', 'Bangalore Central Warehouse', monitor.id, 4, 'In Transit'],
    ['TR-2026-1003', 'Bangalore Central Warehouse', 'Chennai Regional Hub', scanner.id, 2, 'Draft'],
  ] as const;
  for (const [number, from, to, productId, qty, status] of transferDefs) {
    await query(
      `INSERT INTO stock_transfers(transfer_number,from_warehouse,to_warehouse,product_id,quantity,status,created_by)
       VALUES($1::varchar,$2::varchar,$3::varchar,$4::integer,$5::integer,$6::varchar,$7::integer) ON CONFLICT(transfer_number) DO NOTHING`,
      [number, from, to, productId, qty, status, warehouseUser],
    );
  }

  const auditExists = await query(`SELECT 1 FROM audit_logs WHERE entity='System' AND entity_id='DEMO' AND action='Seeded demo operations' LIMIT 1`);
  if (!auditExists.rowCount) {
    await query(
      `INSERT INTO audit_logs(user_id,action,entity,entity_id,details) VALUES
       ($1::integer,'Seeded demo operations','System','DEMO','Products, customers, procurement, sales, invoices and stock movements loaded')`,
      [admin],
    );
  }

  await query(`INSERT INTO demo_seed_runs(key) VALUES('fundsroom-v4-demo') ON CONFLICT DO NOTHING`);
}
