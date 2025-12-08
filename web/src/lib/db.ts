import { SQL } from "bun";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = new SQL(process.env.DATABASE_URL);

export default sql;
