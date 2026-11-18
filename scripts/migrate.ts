// Migration-уудыг ажиллуулна: npm run db:migrate
// DIRECT_URL (Session pooler, 5432) ашиглана — DDL-д transaction pooler тохиромжгүй.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error("DIRECT_URL / DATABASE_URL тохируулаагүй байна.");

const client = postgres(url, { max: 1 });
migrate(drizzle(client), { migrationsFolder: "./drizzle" })
  .then(() => console.log("Migration амжилттай."))
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => client.end());
