// Хөгжүүлэлтийн жишээ зарууд. ЗОХИОМОЛ өгөгдөл — production DB-д ажиллуулахгүй.
// Ажиллуулах: npm run db:seed
import { db } from "../lib/db";
import { listings, type NewListing } from "../lib/db/schema";

const SAMPLE: NewListing[] = [
  { title: "Prius 30 батерей, шинэчилсэн модультай", type: "battery", modelSlug: "prius-30", price: 1_850_000, location: "Баянзүрх", warrantyMonths: 12, createdAt: new Date("2026-11-15") },
  { title: "Aqua батерейны оношилгоо + тэнцвэржүүлэлт", type: "repair", modelSlug: "aqua", price: 120_000, location: "Сонгинохайрхан", warrantyMonths: 3, createdAt: new Date("2026-11-14") },
  { title: "Prius 20 модуль (ширхгээр)", type: "cell", modelSlug: "prius-20", price: 45_000, location: "Хан-Уул", warrantyMonths: null, createdAt: new Date("2026-11-14") },
  { title: "Camry Hybrid батерей, Япон задаргаа", type: "battery", modelSlug: "camry", price: 2_400_000, location: "Чингэлтэй", warrantyMonths: 6, createdAt: new Date("2026-11-13") },
  { title: "Harrier Hybrid батерей солих үйлчилгээ", type: "repair", modelSlug: "harrier", price: 250_000, location: "Сүхбаатар", warrantyMonths: 6, createdAt: new Date("2026-11-12") },
  { title: "Prius 50 Li-ion батерей", type: "battery", modelSlug: "prius-50", price: 3_200_000, location: "Баянгол", warrantyMonths: 12, createdAt: new Date("2026-11-11") },
];

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Production орчинд seed ажиллуулахгүй.");
  const existing = await db.$count(listings);
  if (existing > 0) {
    console.log(`listings хүснэгтэд ${existing} мөр байна — seed алгаслаа.`);
    return;
  }
  await db.insert(listings).values(SAMPLE);
  console.log(`${SAMPLE.length} жишээ зар нэмлээ.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
