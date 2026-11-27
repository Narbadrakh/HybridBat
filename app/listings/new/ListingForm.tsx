"use client";

import { useActionState, useState } from "react";
import { createListing, type FormState } from "./actions";
import { LISTING_TYPE_LABEL } from "@/lib/listing-types";

type ModelOption = { slug: string; name: string; years: string };

const input =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#138a6e] focus:outline-none focus:ring-2 focus:ring-[#138a6e]/20";

function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>
      )}
    </label>
  );
}

export function ListingForm({ models }: { models: ModelOption[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(createListing, undefined);
  const e = state?.fieldErrors ?? {};

  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>();

  function onImageChange(ev: React.ChangeEvent<HTMLInputElement>) {
    if (preview) URL.revokeObjectURL(preview);
    const f = ev.target.files?.[0];
    if (!f) {
      setPreview(null);
      setImageError(undefined);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setImageError("Зураг 5MB-аас бага байна.");
      setPreview(null);
      ev.target.value = "";
      return;
    }
    setImageError(undefined);
    setPreview(URL.createObjectURL(f));
  }

  return (
    <form action={action} className="space-y-5">
      {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}

      <Field label="Гарчиг" name="title" error={e.title} hint="Жишээ нь: Prius 30 батерей, шинэчилсэн модультай">
        <input id="title" name="title" required minLength={5} maxLength={120} className={input} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Төрөл" name="type" error={e.type}>
          <select id="type" name="type" required defaultValue="" className={input}>
            <option value="" disabled>
              Сонгох
            </option>
            {Object.entries(LISTING_TYPE_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Загвар" name="modelSlug" error={e.modelSlug}>
          <select id="modelSlug" name="modelSlug" required defaultValue="" className={input}>
            <option value="" disabled>
              Сонгох
            </option>
            {models.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name} ({m.years})
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Үнэ (₮)" name="price" error={e.price}>
          <input id="price" name="price" required inputMode="numeric" placeholder="1850000" className={input} />
        </Field>
        <Field label="Баталгаа (сар)" name="warrantyMonths" error={e.warrantyMonths} hint="Баталгаагүй бол хоосон үлдээнэ">
          <input id="warrantyMonths" name="warrantyMonths" inputMode="numeric" placeholder="12" className={input} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Байршил" name="location" error={e.location} hint="Дүүрэг эсвэл аймаг">
          <input id="location" name="location" required maxLength={80} placeholder="Баянзүрх" className={input} />
        </Field>
        <Field label="Утас" name="phone" error={e.phone}>
          <input id="phone" name="phone" required type="tel" placeholder="99112233" className={input} />
        </Field>
      </div>

      <Field
        label="Зураг"
        name="image"
        error={imageError ?? e.image}
        hint="JPG, PNG эсвэл WebP, 5MB хүртэл (заавал биш)"
      >
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onImageChange}
          className={input}
        />
      </Field>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Сонгосон зургийн урьдчилсан харалт"
          className="aspect-[4/3] w-full max-w-sm rounded-lg border border-slate-200 object-cover"
        />
      )}

      <Field label="Тайлбар" name="description" error={e.description} hint="Модулийн байдал, баталгааны нөхцөл гэх мэт">
        <textarea id="description" name="description" rows={5} maxLength={2000} className={input} />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#138a6e] px-4 py-2.5 font-semibold text-white hover:bg-[#0f6f58] disabled:opacity-60"
      >
        {pending ? "Хадгалж байна…" : "Зар нийтлэх"}
      </button>
    </form>
  );
}