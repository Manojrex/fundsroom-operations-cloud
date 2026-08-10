import "dotenv/config";
import { Pool, QueryResult, QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const isLocalDatabase =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ssl: isLocalDatabase
    ? false
    : {
        rejectUnauthorized: false,
      },
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

/**
 * Execute a PostgreSQL query.
 *
 * Returns the complete QueryResult so existing routes can use:
 *   result.rows
 *   result.rowCount
 *   result.command
 */
export async function query<
  T extends QueryResultRow = QueryResultRow
>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

/**
 * Initialize/check the database connection.
 *
 * The actual tables are already present in the PostgreSQL database,
 * and seedDemoData() handles demo data.
 */
export async function initDb(): Promise<void> {
  await pool.query("SELECT 1");
  console.log("PostgreSQL database connected");
}

/**
 * Check database connectivity.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    return false;
  }
}

/**
 * Gracefully close the connection pool.
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
}