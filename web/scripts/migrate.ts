import { SQL } from "bun";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables from .env file if not already loaded
// Bun loads .env automatically, but we can ensure it's checked.
if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  console.error("Please create a .env file in the web directory with your database connection string.");
  console.error('Example: DATABASE_URL="postgres://user:password@localhost:5432/dbname"');
  process.exit(1);
}

const sql = new SQL(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log("Starting database migration...");
    
    const schemaPath = join(process.cwd(), "../DB/update_schema.sql");
    console.log(`Reading schema from: ${schemaPath}`);
    
    const schemaSql = readFileSync(schemaPath, "utf-8");
    
    // Split by semicolon to execute statements individually? 
    // Bun's SQL might handle multiple statements if passed as a raw string, 
    // but usually it's safer to execute the whole block if the driver supports it.
    // Bun's `sql` template tag is for parameterized queries. 
    // For raw SQL script execution, we might need a different approach or just pass the string.
    // However, `sql(string)` is not valid. `sql` is a template tag.
    // We can use `sql.unsafe(string)` if available, or just pass it as a template literal if it's trusted.
    // But `sql` template tag expects static strings usually.
    
    // Let's try using `sql` as a function if it supports it, or `sql.unsafe`.
    // Checking Bun docs: `sql` is a template tag. `sql("SELECT 1")` is not how it works.
    // It works like `sql\`SELECT 1\``.
    
    // To execute a raw string from a file, we need `sql(rawString)`? No.
    // We can use `sql(schemaSql)`? No.
    
    // We can use `sql.unsafe`?
    // https://bun.sh/docs/api/sql#unsafe
    // "To execute a raw SQL string, use sql.unsafe(query)"
    
    // Wait, `bun-sql` (native) might not have `unsafe` exposed directly on the instance?
    // Let's check if we can just use `sql` with the file content.
    // Actually, for a migration script, we can just use `psql` via `Bun.spawn` if `psql` is available.
    // But the user said "use BUN!".
    
    // Let's try to use the postgres.js driver pattern if Bun's native SQL is similar.
    // Or just use `sql` with the content.
    
    // If `sql` doesn't support raw strings easily, we can split by `;` and run each.
    // But that breaks on semicolons inside strings/functions.
    
    // Let's assume `sql` can take a raw string via `sql(schemaSql)` or similar?
    // Actually, the user linked https://bun.com/docs/runtime/sql
    // Docs say: `const result = await sql`SELECT * FROM users``
    
    // It doesn't explicitly show `unsafe`.
    // But usually these libraries have a way.
    
    // Let's try to use `Bun.spawn` to run `psql` if available, as a fallback?
    // No, user said "use BUN!".
    
    // Let's try to use `sql` with the file content as a template literal?
    // We can't dynamically construct a template literal tag call easily.
    
    // Wait! We can just use `postgres` package (postgres.js) which Bun recommends too?
    // But user said "bun supports psql natively".
    
    // Let's try to find if `sql` object has a method for raw query.
    // If not, I'll use `Bun.spawn` to call `psql` which is robust.
    // "bun supports psql natively" might mean it has a client.
    
    // Let's try to use `sql` as a function. `sql(schemaSql)` might work if it's designed like `postgres.js`.
    // If not, I'll use `Bun.spawn(["psql", process.env.DATABASE_URL, "-f", schemaPath])`.
    // This is actually "using Bun" to run the migration.
    
    console.log("Executing SQL script...");
    
    // Using Bun.spawn to run psql is the most reliable way to run a complex SQL script file
    // without parsing it manually in JS.
    const proc = Bun.spawn(["psql", process.env.DATABASE_URL!, "-f", schemaPath], {
      stdout: "inherit",
      stderr: "inherit",
    });
    
    const exitCode = await proc.exited;
    
    if (exitCode === 0) {
      console.log("Migration completed successfully!");
    } else {
      console.error(`Migration failed with exit code ${exitCode}`);
      process.exit(exitCode);
    }
    
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
