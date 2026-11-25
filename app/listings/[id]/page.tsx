import { notFound } from "next/navigation";
import { getListingById } from "@/lib/listings";
import { formatPrice, LISTING_TYPE_LABEL } from "@/lib/listing-types";

type Props = {
  params: Promise<{ id: string }>;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ListingPage({ params }: Props) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    notFound();
  }

  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const typeLabel =
    listing.type in LISTING_TYPE_LABEL
      ? LISTING_TYPE_LABEL[listing.type as keyof typeof LISTING_TYPE_LABEL]
      : listing.type;

  return (
    <div className="container-page max-w-3xl py-10">
      <p className="text-sm font-semibold text-[#138a6e]">{typeLabel}</p>
      <h1 className="mt-1 text-3xl font-bold">{listing.title}</h1>
      <p className="mt-2 text-2xl font-bold text-[#138a6e]">
        {formatPrice(listing.price)}
      </p>
      <p className="mt-1 text-zinc-500">
        {listing.location}
        {listing.warrantyMonths ? ` · ${listing.warrantyMonths} сар баталгаа` : ""}
      </p>

      {listing.description && (
        <p className="mt-6 whitespace-pre-line">{listing.description}</p>
      )}

      {listing.phone ? (
        <a
          href={`tel:${listing.phone}`}
          className="mt-8 inline-block rounded-lg bg-[#138a6e] px-6 py-3 font-semibold text-white hover:bg-[#0f6f58]"
        >
          Залгах: {listing.phone}
        </a>
      ) : (
        <p className="mt-8 text-zinc-500">Утасны дугаар оруулаагүй байна.</p>
      )}
    </div>
  );
}