import { sql } from "drizzle-orm";
import { check, index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Зарын төрөл: бүтэн батерей, засвар үйлчилгээ, модуль / эс
export const listingType = pgEnum("listing_type", ["battery", "repair", "cell"]);

// Зарын төлөв: идэвхтэй, зарагдсан, нуусан (админ эсвэл зарлагч)
export const listingStatus = pgEnum("listing_status", ["active", "sold", "hidden"]);

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    type: listingType("type").notNull(),
    // lib/models.ts доторх slug. Загваруудыг DB рүү шилжүүлэхэд foreign key болгоно.
    modelSlug: text("model_slug").notNull(),
    price: integer("price").notNull(), // ₮
    location: text("location").notNull(),
    warrantyMonths: integer("warranty_months"),
    phone: text("phone"),
    // Supabase Storage-ийн нийтийн зургийн холбоос (заавал биш)
    imageUrl: text("image_url"),
    status: listingStatus("status").notNull().default("active"),
    // Clerk-ийн хэрэглэгчийн id. Нэвтрэлт нэмэгдэх хүртэл хоосон (админ оруулсан зар).
    userId: text("user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // Нийтэд зөвхөн идэвхтэй зар харуулдаг тул partial index
    index("listings_active_created_idx").on(t.createdAt.desc()).where(sql`${t.status} = 'active'`),
    index("listings_active_model_created_idx")
      .on(t.modelSlug, t.createdAt.desc())
      .where(sql`${t.status} = 'active'`),
    check("listings_price_nonneg", sql`${t.price} >= 0`),
    check("listings_warranty_nonneg", sql`${t.warrantyMonths} >= 0`),
  ],
  // RLS (policy-гүй): Supabase-ийн anon REST API-аар шууд хандахаас хамгаална.
  // Апп DATABASE_URL (postgres эрх)-ээр холбогддог тул RLS-д саад болохгүй.
).enableRLS();

export type ListingRow = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;