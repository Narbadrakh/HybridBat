import Link from "next/link";
import { MODELS } from "@/lib/models";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-[#0f172a] text-[#cbd5e1]">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-white">
            HybridBat<span className="text-[#138a6e]">.mn</span>
          </p>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Toyota hybrid батерейны засвар, сэлбэгийн зарын нэгдсэн сайт.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Загварууд</p>
          <ul className="mt-3 grid grid-cols-2 gap-1 text-sm">
            {MODELS.map((m) => (
              <li key={m.slug}>
                <Link href={`/models/${m.slug}`} className="hover:text-white">
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Холбоос</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link href="/listings" className="hover:text-white">Бүх зар</Link></li>
            <li><Link href="/listings/new" className="hover:text-white">Зар нэмэх</Link></li>
            <li><Link href="/sign-in" className="hover:text-white">Нэвтрэх</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[#94a3b8]">
        © 2026 HybridBat.mn
      </div>
    </footer>
  );
}
