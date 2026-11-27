import "server-only";
import { and, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import type { Listing, ListingType } from "@/lib/listing-types";

const cardColumns = {
  id: listings.id,
  title: listings.title,
  type: listings.type,
  modelSlug: listings.modelSlug,
  price: listings.price,
  location: listings.location,
  warrantyMonths: listings.warrantyMonths,
  imageUrl: listings.imageUrl,
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

export type ListingFilters = {
  model?: string;
  type?: ListingType;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
};

const esc = (s: string) => s.replace(/[\\%_]/g, "\\$&");

export async function searchListings(f: ListingFilters, limit = 50): Promise<Listing[]> {
  const where = and(
    eq(listings.status, "active"),
    f.model ? eq(listings.modelSlug, f.model) : undefined,
    f.type ? eq(listings.type, f.type) : undefined,
    f.q
      ? or(
          ilike(listings.title, `%${esc(f.q)}%`),
          ilike(listings.description, `%${esc(f.q)}%`),
        )
      : undefined,
    f.minPrice != null ? gte(listings.price, f.minPrice) : undefined,
    f.maxPrice != null ? lte(listings.price, f.maxPrice) : undefined,
  );

  return db
    .select(cardColumns)
    .from(listings)
    .where(where)
    .orderBy(desc(listings.createdAt))
    .limit(limit);
}

export async function getListingById(id: string) {
  const [row] = await db
    .select()
    .from(listings)
    .where(and(eq(listings.id, id), eq(listings.status, "active")))
    .limit(1);
  return row ?? null;
}