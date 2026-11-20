import Image from "next/image";
import { getModelImage } from "@/lib/model-images";

// Машины зураг. Байхгүй бол машины дүрстэй орлуулга.
export function ModelPhoto({
  slug,
  name,
  className = "",
  preload = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  slug: string;
  name: string;
  className?: string;
  preload?: boolean;
  sizes?: string;
}) {
  const src = getModelImage(slug);
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-100 ${className}`}>
      {src ? (
        <Image src={src} alt={name} fill sizes={sizes} preload={preload} className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-slate-400">
          <svg viewBox="0 0 120 50" className="w-1/2 max-w-48" aria-hidden="true">
            <path
              d="M8 36c0-6 3-9 9-10l14-3 14-11c3-2 6-3 10-3h22c5 0 9 2 12 5l9 9 10 2c4 1 6 4 6 8v3c0 2-1 3-3 3h-6M33 39H27M98 39H45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="39" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="91" cy="39" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
          <span className="absolute bottom-3 text-xs">{name} · зураг удахгүй</span>
        </div>
      )}
    </div>
  );
}
