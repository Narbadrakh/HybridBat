import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL тохируулаагүй байна. .env.local файлыг шалгана уу (.env.example-г үзнэ үү).");
}

// Dev горимд hot reload бүрт шинэ холболт үүсгэхгүйн тулд global дээр хадгална.
// URL-аар нь түлхүүрлэсэн тул .env.local өөрчлөгдвөл шинэ холболт үүснэ.
const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof postgres>; pgUrl?: string };

if (globalForDb.pgClient && globalForDb.pgUrl !== url) {
  void globalForDb.pgClient.end({ timeout: 5 });
  globalForDb.pgClient = undefined;
}
const client = globalForDb.pgClient ?? postgres(url, { max: 5 });
if (process.env.NODE_ENV !== "production") {
  globalForDb.pgClient = client;
  globalForDb.pgUrl = url;
}

export const db = drizzle(client, { schema });
export { schema };
