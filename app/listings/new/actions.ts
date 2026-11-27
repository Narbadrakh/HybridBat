"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { getModel } from "@/lib/models";
import { LISTING_TYPE_LABEL, type ListingType } from "@/lib/listing-types";
import { LISTING_IMAGES_BUCKET, supabaseAdmin } from "@/lib/supabase-admin";

export type FormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function int(v: string) {
  const n = Number(v.replace(/[\s',]/g, ""));
  return Number.isInteger(n) ? n : NaN;
}

// Файлын нэр, MIME-д найдахгүй: эхний байтуудаар жинхэнэ төрлийг нь шалгана.
function detectImageType(b: Uint8Array): { mime: string; ext: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return { mime: "image/png", ext: "png" };
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && // "RIFF"
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50 // "WEBP"
  )
    return { mime: "image/webp", ext: "webp" };
  return null;
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

  // Зураг (заавал биш)
  const file = fd.get("image");
  let upload: { buffer: Buffer; mime: string; ext: string } | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_IMAGE_BYTES) {
      fieldErrors.image = "Зураг 5MB-аас бага байна.";
    } else {
      const buffer = Buffer.from(await file.arrayBuffer());
      const kind = detectImageType(buffer);
      if (!kind) fieldErrors.image = "Зөвхөн JPG, PNG, WebP зураг оруулна уу.";
      else upload = { buffer, ...kind };
    }
  }

  if (Object.keys(fieldErrors).length) return { fieldErrors };

  // Зургийг Storage-д оруулна. Нэрийг санамсаргүй UUID болгоно.
  let imageUrl: string | null = null;
  let imagePath: string | null = null;
  if (upload) {
    imagePath = `${crypto.randomUUID()}.${upload.ext}`;
    const { error } = await supabaseAdmin.storage
      .from(LISTING_IMAGES_BUCKET)
      .upload(imagePath, upload.buffer, {
        contentType: upload.mime,
        cacheControl: "31536000",
        upsert: false,
      });
    if (error) {
      console.error("Зураг оруулахад алдаа:", error.message);
      return { error: "Зураг оруулахад алдаа гарлаа. Дахин оролдоно уу." };
    }
    imageUrl = supabaseAdmin.storage.from(LISTING_IMAGES_BUCKET).getPublicUrl(imagePath).data.publicUrl;
  }

  try {
    await db.insert(listings).values({
      title,
      type,
      modelSlug,
      price,
      location,
      warrantyMonths,
      phone,
      description: description || null,
      imageUrl,
      userId,
    });
  } catch (err) {
    console.error("Зар хадгалахад алдаа:", err);
    // Хадгалагдаагүй зарын зураг Storage-д үлдэхгүй байлгана
    if (imagePath) await supabaseAdmin.storage.from(LISTING_IMAGES_BUCKET).remove([imagePath]);
    return { error: "Зар хадгалахад алдаа гарлаа. Дахин оролдоно уу." };
  }

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/models/${modelSlug}`);
  redirect(`/models/${modelSlug}#listings`);
}