import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import type { Listing } from "@/lib/listing-types";

// Зөвхөн нийтэд харагдах талбарууд (утас, user_id зэргийг жагсаалтад гаргахгүй)
const cardColumns = {
  id: listings.id,
  title: listings.title,
  type: listings.type,
  modelSlug: listings.modelSlug,
  price: listings.price,
  location: listings.location,
  warrantyMonths: listings.warrantyMonths,
  createdAt: listings.createdAt,
};

export async function getLatestListings(limit = 6): Promise<Listing[]> {
  return db
    .select(cardColumns)
    .from(listings)
    .where(eq(listings.status, "active"))
    .orderBy(desc(listings.createdAt))
    .limit(limit);
}

export async function getListingsByModel(modelSlug: string, limit = 12): Promise<Listing[]> {
  return db
    .select(cardColumns)
    .from(listings)
    .where(and(eq(listings.modelSlug, modelSlug), eq(listings.status, "active")))
    .orderBy(desc(listings.createdAt))
    .limit(limit);
}
