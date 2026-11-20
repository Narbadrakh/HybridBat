import Link from "next/link";
import { AuthNav } from "@/app/_components/AuthNav";
import { ThemeToggle } from "@/app/_components/ThemeToggle";

const NAV = [
  { href: "/listings", label: "Зарууд" },
  { href: "/#models", label: "Загварууд" },
  { href: "/#how", label: "Яаж ажилладаг" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-surface/90 backdrop-blur">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#138a6e] text-sm text-white">
            HB
          </span>
          HybridBat<span className="text-[#138a6e]">.mn</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-[#138a6e]">
              {n.label}
            </Link>
          ))}
          <AuthNav />
          <ThemeToggle />
          <Link
            href="/listings/new"
            className="rounded-lg bg-[#138a6e] px-4 py-2 font-semibold text-white hover:bg-[#0f6f58]"
          >
            + Зар нэмэх
          </Link>
        </nav>

        {/* Mobile: JS-гүй цэс (details/summary) */}
        <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <details className="group relative">
          <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-3 py-1.5 text-sm">
            Цэс
          </summary>
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-surface p-2 shadow-lg">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
                {n.label}
              </Link>
            ))}
            <AuthNav mobile />
            <Link
              href="/listings/new"
              className="mt-1 block rounded-lg bg-[#138a6e] px-3 py-2 text-center text-sm font-semibold text-white"
            >
              + Зар нэмэх
            </Link>
          </div>
        </details>
        </div>
      </div>
    </header>
  );
}
