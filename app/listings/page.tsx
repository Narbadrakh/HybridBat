import Link from "next/link";
import { searchListings } from "@/lib/listings";
import {
  formatPrice,
  LISTING_TYPE_LABEL,
  type ListingType,
} from "@/lib/listing-types";

type Props = { searchParams: Promise<Record<string, string | undefined>> };

const num = (v?: string) =>
  v && !Number.isNaN(Number(v)) ? Number(v) : undefined;

export default async function ListingsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const type =
    sp.type && sp.type in LISTING_TYPE_LABEL
      ? (sp.type as ListingType)
      : undefined;

  const items = await searchListings({
    model: sp.model || undefined,
    type,
    q: sp.q?.trim() || undefined,
    minPrice: num(sp.min),
    maxPrice: num(sp.max),
  });

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold">Зарууд</h1>

      <form className="mt-6 grid gap-3 md:grid-cols-5">
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Хайх..."
          className="rounded-lg border px-3 py-2 md:col-span-2"
        />
        <select
          name="type"
          defaultValue={type ?? ""}
          className="rounded-lg border px-3 py-2"
        >
          <option value="">Бүх төрөл</option>
          {Object.entries(LISTING_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          name="min"
          defaultValue={sp.min}
          placeholder="Доод үнэ ₮"
          inputMode="numeric"
          className="rounded-lg border px-3 py-2"
        />
        <input
          name="max"
          defaultValue={sp.max}
          placeholder="Дээд үнэ ₮"
          inputMode="numeric"
          className="rounded-lg border px-3 py-2"
        />
        {sp.model && <input type="hidden" name="model" value={sp.model} />}
        <button className="rounded-lg bg-[#138a6e] px-4 py-2 font-semibold text-white hover:bg-[#0f6f58] md:col-span-5 md:w-40">
          Хайх
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-500">{items.length} зар</p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => (
          <Link
            key={l.id}
            href={`/listings/${l.id}`}
            className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md"
          >
            <p className="text-xs font-semibold text-[#138a6e]">
              {LISTING_TYPE_LABEL[l.type]}
            </p>
            <p className="mt-1 font-semibold">{l.title}</p>
            <p className="mt-1 text-lg font-bold text-[#138a6e]">
              {formatPrice(l.price)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {l.location}
              {l.warrantyMonths ? ` · ${l.warrantyMonths} сар баталгаа` : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}