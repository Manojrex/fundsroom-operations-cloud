# Postman / API demonstration

Base URL: `http://localhost:5000/api` locally, or your deployed Render URL.

## 1. Login
`POST /auth/login`

```json
{"email":"admin@fundsroom.local","password":"Fundsroom@123"}
```

Copy the returned JWT into Postman as `Authorization: Bearer <token>`.

## 2. Customer
`POST /customers`

```json
{"name":"Apex Traders","mobile":"9876543210","email":"ops@apextraders.in","business_name":"Apex Traders","customer_type":"Wholesale","status":"Active","address":"Bengaluru"}
```

## 3. Product
`POST /products`

```json
{"name":"Industrial Sensor","sku":"SEN-001","category":"Electronics","unit_price":2499,"current_stock":20,"min_stock":5,"warehouse":"Main Warehouse"}
```

## 4. Draft challan
`POST /challans`

```json
{"customer_id":1,"items":[{"product_id":1,"quantity":5}]}
```

## 5. Confirm
`POST /challans/:id/confirm`

Expected: stock decreases from 20 to 15 and an `OUT` stock movement is recorded.

## 6. Negative-stock test
Create another draft requesting more than the available quantity, then confirm it.

Expected: HTTP 500 with the API error message `Insufficient stock...`; the transaction rolls back and inventory is unchanged.
