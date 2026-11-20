"use client";

// Цайвар / хар theme солих товч. Сонголтыг localStorage-д хадгална.
// Анхны ачаалалд класс тавих script нь layout.tsx-д байгаа (анивчихгүйн тулд).
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Цайвар / хар горим солих"
      title="Цайвар / хар горим"
      className={`grid h-9 w-9 place-items-center rounded-lg border border-slate-300 text-slate-700 hover:border-[#138a6e] hover:text-[#138a6e] ${className}`}
    >
      {/* Хоёр дүрсийг хоёуланг нь рендерлээд CSS-ээр нэгийг нь харуулна: hydration зөрөхгүй */}
      <svg viewBox="0 0 24 24" className="h-5 w-5 dark:hidden" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 24 24" className="hidden h-5 w-5 dark:block" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}
