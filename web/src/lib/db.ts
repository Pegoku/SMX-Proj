import { sql } from 'bun';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Bun's built-in PostgreSQL client
const db = sql(process.env.DATABASE_URL);

export default db;
