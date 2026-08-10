import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initDb } from "./db";
import { seedDemoData } from "./seed";

import auth from "./routes/auth";
import customers from "./routes/customers";
import products from "./routes/products";
import challans from "./routes/challans";
import dashboard from "./routes/dashboard";
import suppliers from "./routes/suppliers";
import purchases from "./routes/purchases";
import invoices from "./routes/invoices";
import reports from "./routes/reports";
import transfers from "./routes/transfers";
import audit from "./routes/audit";
import ai from "./routes/ai";

import { errorHandler } from "./middleware/error";

dotenv.config();

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
| Allow the local Vite frontend on both common development ports.
| Also supports CORS_ORIGIN from environment variables for deployment.
|--------------------------------------------------------------------------
*/

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

const configuredOrigins =
  process.env.CORS_ORIGIN
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const allowedOrigins = [
  ...new Set([...defaultOrigins, ...configuredOrigins]),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman, curl, server-to-server requests, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,

    optionsSuccessStatus: 204,
  })
);

/*
|--------------------------------------------------------------------------
| Body parser
|--------------------------------------------------------------------------
*/

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Fundsroom ERP API",
    version: "4.0.0",
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", auth);

app.use("/api/customers", customers);

app.use("/api/products", products);

app.use("/api/challans", challans);

app.use("/api/dashboard", dashboard);

app.use("/api/suppliers", suppliers);

app.use("/api/purchases", purchases);

app.use("/api/invoices", invoices);

app.use("/api/reports", reports);

app.use("/api/transfers", transfers);

app.use("/api/audit", audit);

app.use("/api/ai", ai);

/*
|--------------------------------------------------------------------------
| Error handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const port = Number(process.env.PORT) || 5000;

/*
|--------------------------------------------------------------------------
| Database initialization → Demo seed → Start server
|--------------------------------------------------------------------------
*/

initDb()
  .then(() => seedDemoData())
  .then(() => {
    app.listen(port, () => {
      console.log(`Fundsroom API running on ${port}`);
      console.log(`Allowed CORS origins:`);
      allowedOrigins.forEach((origin) => {
        console.log(`  ✓ ${origin}`);
      });
    });
  })
  .catch((error: unknown) => {
    console.error("Failed to start Fundsroom API:");

    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }

    process.exit(1);
  });