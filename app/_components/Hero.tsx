import Image from "next/image";
import Link from "next/link";
import { MODELS } from "@/lib/models";

export function Hero() {
  return (
    // Доорх хэсгүүдтэй ижил өргөн (container-page) дотор, дугуй булантай хайрцаг
    <section className="container-page pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-black">
        {/* Арын зураг: баруун талд "CHECK HYBRID SYSTEM" анхааруулга харагдана */}
        <Image
          src="/hero-warning.jpg"
          alt="Самбар дээр Check Hybrid System анхааруулга асасан"
          fill
          preload
          sizes="(min-width: 88rem) 88rem, 100vw"
          className="object-cover object-[center_30%]"
        />
        {/* Зүүн талаас харанхуйлна: баруун талын анхааруулга тод, зүүн талын текст уншигдахуйц */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 md:bg-gradient-to-r md:from-black/90 md:via-black/60 md:via-45% md:to-transparent" />

        <div className="relative grid min-h-[480px] items-center px-6 py-14 text-white md:min-h-[560px] md:grid-cols-2 md:px-12 lg:px-16">
          <div>
            <p className="mb-3 inline-block rounded-full bg-[#138a6e] px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              Toyota Hybrid
            </p>
            <h1 className="text-4xl leading-tight font-extrabold md:text-5xl">
              Hybrid батерейны засвар, сэлбэгийг нэг дор ол
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Prius, Aqua, Camry Hybrid болон бусад Toyota загварын үндсэн
              батерейны засвар, сэлбэгийн зар.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/listings" className="rounded-lg bg-[#138a6e] px-6 py-3 font-semibold hover:bg-[#0f6f58]">
                Зар хайх
              </Link>
              <Link
                href="/listings/new"
                className="rounded-lg border border-white px-6 py-3 font-semibold hover:bg-white hover:text-black"
              >
                Зар нэмэх
              </Link>
            </div>

            {/* Загварын хурдан шүүлтүүр */}
            <ul className="mt-8 flex flex-wrap gap-2">
              {MODELS.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/models/${m.slug}`}
                    title={m.years}
                    className="block rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur transition-colors hover:border-[#138a6e] hover:bg-[#138a6e]"
                  >
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
