import Image from "next/image";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/listings";
import { formatPrice, LISTING_TYPE_LABEL } from "@/lib/listing-types";

type Props = { params: Promise<{ id: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const l = await getListingById(id);
  if (!l) notFound();

  return (
    <div className="container-page max-w-3xl py-10">
      {l.imageUrl && (
        <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={l.imageUrl}
            alt={l.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <p className="text-sm font-semibold text-[#138a6e]">{LISTING_TYPE_LABEL[l.type]}</p>
      <h1 className="mt-1 text-3xl font-bold">{l.title}</h1>
      <p className="mt-2 text-2xl font-bold text-[#138a6e]">{formatPrice(l.price)}</p>
      <p className="mt-1 text-zinc-500">
        {l.location}
        {l.warrantyMonths ? ` · ${l.warrantyMonths} сар баталгаа` : ""}
      </p>

      {l.description && <p className="mt-6 whitespace-pre-line">{l.description}</p>}

      {l.phone ? (
        <a
          href={`tel:${l.phone}`}
          className="mt-8 inline-block rounded-lg bg-[#138a6e] px-6 py-3 font-semibold text-white hover:bg-[#0f6f58]"
        >
          Залгах: {l.phone}
        </a>
      ) : (
        <p className="mt-8 text-zinc-500">Утасны дугаар оруулаагүй байна.</p>
      )}
    </div>
  );
}