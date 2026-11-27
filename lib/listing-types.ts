// Зарын төрөл, шошго, форматлах функцууд. DB-ээс хамааралгүй тул хаана ч import хийж болно.
import type { ListingRow } from "@/lib/db/schema";

export type ListingType = ListingRow["type"];

// UI-д хэрэгтэй талбарууд л
export type Listing = Pick<
  ListingRow,
  | "id"
  | "title"
  | "type"
  | "modelSlug"
  | "price"
  | "location"
  | "warrantyMonths"
  | "imageUrl"
  | "createdAt"
>;

export const LISTING_TYPE_LABEL: Record<ListingType, string> = {
  battery: "Бүтэн батерей",
  repair: "Засвар үйлчилгээ",
  cell: "Модуль / эс",
};

export function formatPrice(n: number) {
  return n.toLocaleString("en-US").replace(/,/g, "'") + "₮";
}