"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { getModel } from "@/lib/models";
import { LISTING_TYPE_LABEL, type ListingType } from "@/lib/listing-types";

export type FormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function int(v: string) {
  const n = Number(v.replace(/[\s',]/g, ""));
  return Number.isInteger(n) ? n : NaN;
}

export async function createListing(_prev: FormState, fd: FormData): Promise<FormState> {
  // Proxy-д найдахгүй: Server Action-ыг шууд дуудаж болох тул энд заавал шалгана.
  const { userId } = await auth();
  if (!userId) return { error: "Зар нэмэхийн тулд нэвтэрнэ үү." };

  const title = str(fd, "title");
  const type = str(fd, "type") as ListingType;
  const modelSlug = str(fd, "modelSlug");
  const price = int(str(fd, "price"));
  const location = str(fd, "location");
  const warrantyRaw = str(fd, "warrantyMonths");
  const warrantyMonths = warrantyRaw === "" ? null : int(warrantyRaw);
  const phone = str(fd, "phone");
  const description = str(fd, "description");

  const fieldErrors: Record<string, string> = {};
  if (title.length < 5 || title.length > 120) fieldErrors.title = "Гарчиг 5–120 тэмдэгт байна.";
  if (!(type in LISTING_TYPE_LABEL)) fieldErrors.type = "Төрлөө сонгоно уу.";
  if (!getModel(modelSlug)) fieldErrors.modelSlug = "Загвараа сонгоно уу.";
  if (!Number.isInteger(price) || price < 0 || price > 100_000_000) fieldErrors.price = "Үнийг ₮-өөр, тоогоор оруулна уу.";
  if (location.length < 2 || location.length > 80) fieldErrors.location = "Байршлаа оруулна уу.";
  if (warrantyMonths !== null && (!Number.isInteger(warrantyMonths) || warrantyMonths < 0 || warrantyMonths > 60))
    fieldErrors.warrantyMonths = "Баталгаа 0–60 сар байна.";
  if (!/^[0-9+\s-]{8,15}$/.test(phone)) fieldErrors.phone = "Утасны дугаараа оруулна уу (жишээ нь 99112233).";
  if (description.length > 2000) fieldErrors.description = "Тайлбар 2000 тэмдэгтээс хэтрэхгүй.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  await db.insert(listings).values({
    title,
    type,
    modelSlug,
    price,
    location,
    warrantyMonths,
    phone,
    description: description || null,
    userId,
  });

  revalidatePath("/");
  revalidatePath(`/models/${modelSlug}`);
  redirect(`/models/${modelSlug}#listings`);
}
