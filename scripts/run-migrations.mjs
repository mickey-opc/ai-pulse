import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = postgres(databaseUrl, { ssl: "require", prepare: false });
const migrationsDir = path.join(process.cwd(), "db", "migrations");
const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

for (const file of files) {
  const content = await fs.readFile(path.join(migrationsDir, file), "utf8");
  process.stdout.write(`Applying ${file}\n`);
  await sql.unsafe(content);
}

await sql.end();
process.stdout.write("Migrations complete\n");
