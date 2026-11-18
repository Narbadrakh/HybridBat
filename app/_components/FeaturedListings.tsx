import Link from "next/link";
import { LISTING_TYPE_LABEL, formatPrice, type Listing } from "@/lib/listing-types";
import { getLatestListings } from "@/lib/listings";
import { getModel } from "@/lib/models";

const TYPE_STYLE: Record<Listing["type"], string> = {
  battery: "bg-emerald-50 text-emerald-700",
  repair: "bg-amber-50 text-amber-700",
  cell: "bg-sky-50 text-sky-700",
};

export function ListingCard({ l }: { l: Listing }) {
  const model = getModel(l.modelSlug);
  return (
    <Link
      href={`/listings/${l.id}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-1 font-semibold ${TYPE_STYLE[l.type]}`}>
          {LISTING_TYPE_LABEL[l.type]}
        </span>
        {model && <span className="font-medium text-slate-500">{model.name}</span>}
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold group-hover:text-[#138a6e]">{l.title}</h3>
      <div className="mt-auto pt-4">
        <p className="text-xl font-extrabold">{formatPrice(l.price)}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>📍 {l.location}</span>
          <span>{l.warrantyMonths ? `🛡 ${l.warrantyMonths} сар баталгаа` : "Баталгаагүй"}</span>
        </div>
      </div>
    </Link>
  );
}

export async function FeaturedListings() {
  const listings = await getLatestListings(6);
  return (
    <section className="bg-slate-50">
      <div className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Шинэ зарууд</h2>
            <p className="mt-1 text-slate-600">Сүүлд нэмэгдсэн батерей, засвар үйлчилгээ.</p>
          </div>
          <Link href="/listings" className="text-sm font-semibold text-[#138a6e] hover:underline">
            Бүгдийг харах →
          </Link>
        </div>
        {listings.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            Одоогоор зар алга байна.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
