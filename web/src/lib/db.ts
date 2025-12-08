import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: false, // Set to 'require' in production if using SSL
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;
