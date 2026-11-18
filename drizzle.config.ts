import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migration-д Supabase-ийн "Session pooler" (5432) эсвэл direct URL ашиглана
  dbCredentials: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL! },
});
