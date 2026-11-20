import Link from "next/link";
import { MODELS } from "@/lib/models";
import { ModelPhoto } from "@/app/_components/ModelPhoto";

export function ModelCards() {
  return (
    <section id="models" className="container-page scroll-mt-20 py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Загвараар хайх</h2>
          <p className="mt-1 text-slate-600">Машиныхаа загварыг сонгоод тохирох зарыг харна уу.</p>
        </div>
        <Link href="/listings" className="hidden text-sm font-semibold text-[#138a6e] hover:underline sm:block">
          Бүх зар →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {MODELS.map((m) => (
          <Link
            key={m.slug}
            href={`/models/${m.slug}`}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#138a6e] hover:shadow-md"
          >
            <ModelPhoto
              slug={m.slug}
              name={m.name}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="aspect-[16/10] rounded-lg"
            />
            <p className="mt-3 font-semibold group-hover:text-[#138a6e]">{m.name}</p>
            <p className="text-xs text-slate-500">{m.years}</p>
          </Link>
        ))}
        <Link
          href="/listings"
          className="grid place-items-center rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 hover:border-[#138a6e] hover:text-[#138a6e]"
        >
          Бусад загвар →
        </Link>
      </div>
    </section>
  );
}
