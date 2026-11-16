// ТҮР ЗУУРЫН ӨГӨГДӨЛ.
// Дараагийн алхамд Drizzle + Supabase-аас татдаг болгоход зөвхөн энэ файлыг солино.
// Компонентууд `Listing` төрлийг л мэднэ, өгөгдөл хаанаас ирэхийг мэдэхгүй.

export type ListingType = "battery" | "repair" | "cell";

export type Listing = {
  id: string;
  title: string;
  type: ListingType;
  modelSlug: string;
  price: number; // ₮
  location: string;
  warrantyMonths: number | null;
  createdAt: string; // ISO
};

export const LISTING_TYPE_LABEL: Record<ListingType, string> = {
  battery: "Бүтэн батерей",
  repair: "Засвар үйлчилгээ",
  cell: "Модуль / эс",
};

export const FEATURED_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Prius 30 батерей, шинэчилсэн модультай",
    type: "battery",
    modelSlug: "prius-30",
    price: 1_850_000,
    location: "Баянзүрх",
    warrantyMonths: 12,
    createdAt: "2026-11-15",
  },
  {
    id: "2",
    title: "Aqua батерейны оношилгоо + тэнцвэржүүлэлт",
    type: "repair",
    modelSlug: "aqua",
    price: 120_000,
    location: "Сонгинохайрхан",
    warrantyMonths: 3,
    createdAt: "2026-11-14",
  },
  {
    id: "3",
    title: "Prius 20 модуль (ширхгээр)",
    type: "cell",
    modelSlug: "prius-20",
    price: 45_000,
    location: "Хан-Уул",
    warrantyMonths: null,
    createdAt: "2026-11-14",
  },
  {
    id: "4",
    title: "Camry Hybrid батерей, Япон задаргаа",
    type: "battery",
    modelSlug: "camry",
    price: 2_400_000,
    location: "Чингэлтэй",
    warrantyMonths: 6,
    createdAt: "2026-11-13",
  },
  {
    id: "5",
    title: "Harrier Hybrid батерей солих үйлчилгээ",
    type: "repair",
    modelSlug: "harrier",
    price: 250_000,
    location: "Сүхбаатар",
    warrantyMonths: 6,
    createdAt: "2026-11-12",
  },
  {
    id: "6",
    title: "Prius 50 Li-ion батерей",
    type: "battery",
    modelSlug: "prius-50",
    price: 3_200_000,
    location: "Баянгол",
    warrantyMonths: 12,
    createdAt: "2026-11-11",
  },
];

export function formatPrice(n: number) {
  return n.toLocaleString("en-US").replace(/,/g, "'") + "₮";
}
