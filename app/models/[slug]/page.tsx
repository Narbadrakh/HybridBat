import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MODELS, getFamily, getModel, type BatterySpec } from "@/lib/models";
import { getListingsByModel } from "@/lib/listings";
import { ListingCard } from "@/app/_components/FeaturedListings";
import { BatteryDiagram } from "@/app/_components/BatteryDiagram";
import { ModelPhoto } from "@/app/_components/ModelPhoto";

// Зарууд DB-ээс ирдэг тул 60 секунд тутам шинэчилнэ (ISR)
export const revalidate = 60;

// Бүх загварын хуудсыг build хийх үед бэлдэнэ
export function generateStaticParams() {
  return MODELS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/models/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return {};
  return {
    title: `${model.name} hybrid батерей (${model.years}) — HybridBat.mn`,
    description: `${model.name} загварын hybrid батерейны төрөл, хүчдэл, байршил болон зарууд.`,
  };
}

function fmt(v: number | null, unit: string) {
  return v === null ? "Тодруулах" : `${v} ${unit}`;
}

function SpecTable({ spec }: { spec: BatterySpec }) {
  const rows: [string, string][] = [
    ["Төрөл", spec.chemistry === "NiMH" ? "NiMH (никель-металл гидрид)" : "Li-ion (литий-ион)"],
    ["Нэрлэсэн хүчдэл", fmt(spec.voltage, "V")],
    [spec.chemistry === "Li-ion" ? "Эсийн тоо" : "Модулийн тоо", fmt(spec.modules, "ш")],
    ["Багтаамж", fmt(spec.capacityAh, "Ah")],
    ["Байршил", spec.location],
  ];
  return (
    <>
      {spec.check && (
        <p className="mb-2 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
          Утгууд баталгаажаагүй — нягтлах шаардлагатай
        </p>
      )}
      <dl className="divide-y divide-slate-100 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 py-2.5">
            <dt className="text-slate-500">{k}</dt>
            <dd className={`font-medium ${v === "Тодруулах" ? "text-slate-400" : ""}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

const SYMPTOMS = [
  "Самбар дээр «CHECK HYBRID SYSTEM» эсвэл улаан гурвалжин анхааруулга асах",
  "Батерейны заагч хэт хурдан цэнэглэгдэж, хурдан дуусах",
  "Түлшний зарцуулалт мэдэгдэхүйц нэмэгдэх",
  "Хурдлахад хүч сулрах, хөдөлгүүр байнга асаалттай байх",
  "Батерейны хөргөлтийн сэнс байнга чанга ажиллах",
];

type RepairOption = { title: string; text: string; cost: 1 | 2 | 3 | 4 };

// Үнэ нь харьцангуй түвшин (₮ = хамгийн хямд). Бодит үнийг зарууд дээрээс харьцуулна.
const PREVENTIVE: RepairOption[] = [
  {
    title: "Оношилгоо, код уншуулах",
    text: "Сканнераар алдааны код болон блок бүрийн хүчдэлийг уншина. Ямар засвар хэрэгтэйг тодорхойлж, шаардлагагүй солилтоос хамгаална.",
    cost: 1,
  },
  {
    title: "Хөргөлтийн сэнс шалгах, цэвэрлэх",
    text: "Сэнс, агаарын суваг, шүүлтүүрт тоос хуримтлагдвал батерей хэт халж хурдан муудна. Сэнсний ажиллагааг шалгаж цэвэрлэх нь хямд ч батерейны насыг уртасгана.",
    cost: 1,
  },
  {
    title: "12V туслах аккумулятор шалгах",
    text: "Сул 12V аккумулятор hybrid системийн алдаа заалгах тохиолдол бий. Үнэтэй засвар хийхээсээ өмнө эхлээд үүнийг шалгуулаарай.",
    cost: 1,
  },
  {
    title: "Холбогч, шин цэвэрлэх",
    text: "Модуль хоорондын холбогч төмөр зэврэхэд эсэргүүцэл нэмэгдэж алдаа заадаг. Цэвэрлэх эсвэл солиход ихэнхдээ хангалттай.",
    cost: 2,
  },
];

const REPAIR: RepairOption[] = [
  {
    title: "Тэнцвэржүүлэх (сэргээх цэнэглэлт)",
    text: "Тусгай төхөөрөмжөөр модулиудыг цэнэглэж, цэнэггүйжүүлж тэнцвэржүүлнэ. Модуль солихгүйгээр батерейны ажиллагааг сайжруулдаг.",
    cost: 2,
  },
  {
    title: "Модуль солих",
    text: "Зөвхөн муудсан модулиудыг ижил чадалтай модулиар солиод тэнцвэржүүлнэ.",
    cost: 2,
  },
  {
    title: "Сэргээсэн батерей",
    text: "Шалгаж, ангилсан модулиар бүрэн угсарсан батерей. Үнэ, чанарын тэнцвэртэй сонголт.",
    cost: 3,
  },
  {
    title: "Шинэ батерей",
    text: "Шинэ модуль бүхий батерей. Хамгийн үнэтэй ч хамгийн урт хугацаанд ажиллана.",
    cost: 4,
  },
];

const SAVING_TIPS = [
  "Засвар хийлгэхээсээ өмнө модуль бүрийн хүчдэлийн шалгалтын үр дүнг гаргуулж аваарай.",
  "Модуль солиулахдаа ижил чадалтай, сонгон шалгасан модуль тавьж байгаа эсэхийг асуугаарай.",
  "Баталгааны хугацаа, нөхцөлийг бичгээр авч хадгалаарай.",
  "Машинаа удаан хугацаагаар зогсоовол батерей суларна. Тогтмол унаж байх нь батерейд сайн.",
];

function CostBadge({ cost }: { cost: RepairOption["cost"] }) {
  return (
    <span className="shrink-0 font-semibold tracking-wider" title="Харьцангуй зардал">
      <span className="text-[#138a6e]">{"₮".repeat(cost)}</span>
      <span className="text-slate-300">{"₮".repeat(4 - cost)}</span>
    </span>
  );
}

function OptionGrid({ items }: { items: RepairOption[] }) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((o) => (
        <div key={o.title} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold">{o.title}</p>
            <CostBadge cost={o.cost} />
          </div>
          <p className="mt-2 text-sm text-slate-600">{o.text}</p>
        </div>
      ))}
    </div>
  );
}

export default async function ModelPage({ params }: PageProps<"/models/[slug]">) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();

  const family = getFamily(model);
  const listings = await getListingsByModel(model.slug);
  const hasUnverified = model.generations.some((g) => g.batteries.some((b) => b.spec.check));

  return (
    <main className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-[#138a6e]">
          Нүүр
        </Link>
        <span className="mx-2">/</span>
        <Link href="/#models" className="hover:text-[#138a6e]">
          Загварууд
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{model.name}</span>
      </nav>

      {/* Гарчиг + машины зураг */}
      <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1fr_minmax(0,28rem)]">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold tracking-wide text-[#138a6e] uppercase">Hybrid батерей</p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{model.name}</h1>
          <p className="mt-1 text-slate-600">
            {model.years} · {model.generations.map((g) => g.code).join(", ")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {model.generations.flatMap((g) =>
              g.batteries.map((b, i) => (
                <span key={`${g.code}-${i}`} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  {g.code}: {b.spec.chemistry}
                  {b.spec.voltage ? ` · ${b.spec.voltage}V` : ""}
                </span>
              )),
            )}
          </div>
          <Link
            href={`/listings?model=${model.slug}`}
            className="mt-5 inline-block rounded-lg bg-[#138a6e] px-5 py-2.5 font-semibold text-white hover:bg-[#0f6f58]"
          >
            {model.name} зарууд харах
          </Link>
        </div>
        <ModelPhoto
          slug={model.slug}
          name={model.name}
          preload
          className="order-1 aspect-[16/9] rounded-2xl border border-slate-200 lg:order-2"
        />
      </div>

      {/* Ижил гэр бүлийн загварууд: оноор нь сонгоно */}
      {family.length > 1 && (
        <div className="mt-8">
          <p className="text-sm font-medium text-slate-500">Үйлдвэрлэсэн оноор нь сонгох:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {family.map((f) => {
              const active = f.slug === model.slug;
              return (
                <Link
                  key={f.slug}
                  href={`/models/${f.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl border px-4 py-2.5 text-left transition ${
                    active
                      ? "border-[#138a6e] bg-[#138a6e] text-white"
                      : "border-slate-200 bg-white hover:border-[#138a6e]"
                  }`}
                >
                  <span className="block font-semibold">{f.name}</span>
                  <span className={`block text-xs ${active ? "text-emerald-50" : "text-slate-500"}`}>{f.years}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Үе бүрийн батерейны мэдээлэл + ерөнхий мэдээлэл (нэг grid-д, хоосон зай үлдээхгүй) */}
      <section
        className={`mt-10 grid gap-6 ${model.generations.length + 1 === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
      >
        {model.generations.map((g) => (
          <article key={g.code} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-bold">{g.code}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{g.years}</span>
            </div>
            {g.batteries.map((b, i) => (
              <div key={i} className="mt-4">
                {b.label && <h3 className="mb-1 text-sm font-semibold text-[#138a6e]">{b.label}</h3>}
                <p className="mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase">Ерөнхий бүтэц</p>
                <BatteryDiagram spec={b.spec} />
                <div className="mt-4">
                  <SpecTable spec={b.spec} />
                </div>
              </div>
            ))}
            {g.notes && (
              <ul className="mt-4 space-y-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                {g.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span aria-hidden>⚠</span>
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold">Батерей муудаж байгаагийн шинж тэмдэг</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {SYMPTOMS.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#138a6e]" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-500">
            Hybrid батерей ихэвчлэн 8–15 жил ажилладаг. Ашиглалт, уур амьсгал, хөргөлтийн системийн байдлаас их
            хамаарна.
          </p>
        </div>
      </section>

      {/* Засварын сонголтууд: хямдаас үнэтэй рүү */}
      <section className="mt-12 rounded-2xl bg-slate-50 p-6 md:p-8">
        <h2 className="text-2xl font-bold">Засварын сонголтууд</h2>
        <p className="mt-1 text-slate-600">
          Хямдаас үнэтэй рүү эрэмбэлсэн. Эхний алхмуудаар асуудал шийдэгдвэл батерей солих шаардлагагүй болж магадгүй.
        </p>

        <h3 className="mt-8 font-semibold text-[#138a6e]">1. Эхлээд шалгуулах: хямд, урьдчилан сэргийлэх</h3>
        <OptionGrid items={PREVENTIVE} />

        <h3 className="mt-8 font-semibold text-[#138a6e]">2. Батерейны засвар, солилт</h3>
        <OptionGrid items={REPAIR} />

        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-900">Зардал хэмнэх зөвлөгөө</p>
          <ul className="mt-3 grid gap-2 text-sm text-emerald-900 md:grid-cols-2">
            {SAVING_TIPS.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Гэр бүлийн харьцуулалт */}
      {family.length > 1 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Үеүдийн харьцуулалт</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Загвар</th>
                  <th className="px-4 py-3 font-medium">Он</th>
                  <th className="px-4 py-3 font-medium">Кузов</th>
                  <th className="px-4 py-3 font-medium">Төрөл</th>
                  <th className="px-4 py-3 font-medium">Хүчдэл</th>
                  <th className="px-4 py-3 font-medium">Модуль / эс</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {family.flatMap((f) =>
                  f.generations.flatMap((g) =>
                    g.batteries.map((b, i) => (
                      <tr key={`${f.slug}-${g.code}-${i}`} className={f.slug === model.slug ? "bg-emerald-50/60" : ""}>
                        <td className="px-4 py-3 font-semibold">
                          <Link href={`/models/${f.slug}`} className="hover:text-[#138a6e]">
                            {f.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{g.years}</td>
                        <td className="px-4 py-3">{g.code}</td>
                        <td className="px-4 py-3">{b.spec.chemistry}</td>
                        <td className="px-4 py-3">{fmt(b.spec.voltage, "V")}</td>
                        <td className="px-4 py-3">{fmt(b.spec.modules, "ш")}</td>
                      </tr>
                    )),
                  ),
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Энэ загварын зарууд */}
      <section id="listings" className="mt-12 scroll-mt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">{model.name} зарууд</h2>
          <Link href={`/listings?model=${model.slug}`} className="text-sm font-semibold text-[#138a6e] hover:underline">
            Бүгдийг харах →
          </Link>
        </div>
        {listings.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            Одоогоор {model.name}-ийн зар алга.{" "}
            <Link href="/listings/new" className="font-semibold text-[#138a6e] hover:underline">
              Анхны зарыг нэмэх
            </Link>
          </div>
        )}
      </section>

      <p className="mt-12 text-xs text-slate-400">
        Мэдээлэл лавлах зорилготой. Батерей худалдан авахаасаа өмнө кузовын код болон батерейны шошготой тулгаж
        шалгаарай.{hasUnverified && " Энэ загварын зарим утга одоогоор баталгаажаагүй байна."}
      </p>
    </main>
  );
}
