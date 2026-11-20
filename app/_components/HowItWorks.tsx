import Link from "next/link";

const STEPS = [
  { n: "1", title: "Загвараа сонго", text: "Prius, Aqua, Camry гэх мэт машиныхаа загвараар шүүнэ." },
  { n: "2", title: "Зараа харьцуул", text: "Үнэ, баталгаа, байршлыг нэг дор харьцуулна." },
  { n: "3", title: "Шууд холбогд", text: "Зарлагчтай утсаар эсвэл мессежээр шууд холбогдоно." },
];

export function HowItWorks() {
  return (
    <section id="how" className="container-page scroll-mt-20 py-16">
      <h2 className="text-center text-2xl font-bold md:text-3xl">Яаж ажилладаг вэ?</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-xl border border-slate-200 bg-surface p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#138a6e] text-lg font-bold text-white">
              {s.n}
            </div>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{s.text}</p>
          </div>
        ))}
      </div>

      {/* Зарлагчдад зориулсан CTA */}
      <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#138a6e] to-emerald-700 p-8 text-white md:flex-row md:p-10">
        <div>
          <h3 className="text-2xl font-bold">Батерей зардаг эсвэл засвар хийдэг үү?</h3>
          <p className="mt-2 text-white/85">Зараа үнэгүй байршуулж, мянга мянган hybrid эзэмшигчид хүрээрэй.</p>
        </div>
        <Link
          href="/listings/new"
          className="shrink-0 rounded-lg bg-white px-6 py-3 font-semibold text-[#138a6e] hover:bg-[#e3f2ec]"
        >
          Зар нэмэх
        </Link>
      </div>
    </section>
  );
}
