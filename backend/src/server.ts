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
 * -------------------------------------------------------
 * CORS CONFIGURATION
 * -------------------------------------------------------
 */

const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "https://fundsroom-operations-cloud.vercel.app",
  ...envOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman, curl and server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      console.log(`CORS blocked origin: ${origin}`);

      return callback(null, false);
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
 * -------------------------------------------------------
 * BODY PARSING
 * -------------------------------------------------------
 */

app.use(express.json());

/*
 * -------------------------------------------------------
 * HEALTH CHECK
 * -------------------------------------------------------
 */

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Fundsroom ERP API",
    version: "4.0.0",
  });
});

/*
 * -------------------------------------------------------
 * API ROUTES
 * -------------------------------------------------------
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
 * -------------------------------------------------------
 * ERROR HANDLER
 * -------------------------------------------------------
 */

app.use(errorHandler);

/*
 * -------------------------------------------------------
 * START SERVER
 * -------------------------------------------------------
 */

const port = Number(process.env.PORT) || 5000;

initDb()
  .then(seedDemoData)
  .then(() => {
    app.listen(port, () => {
      console.log(`Fundsroom API running on port ${port}`);
    });
  })
  .catch((e: unknown) => {
    console.error("Failed to start Fundsroom API:", e);
    process.exit(1);
  });