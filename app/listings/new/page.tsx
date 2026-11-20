import { auth } from "@clerk/nextjs/server";
import { MODELS } from "@/lib/models";
import { ListingForm } from "./ListingForm";

export const metadata = { title: "Зар нэмэх — HybridBat.mn" };

export default async function NewListingPage() {
  // Нэвтрээгүй бол /sign-in руу шилжүүлнэ.
  await auth.protect();

  const models = MODELS.map(({ slug, name, years }) => ({ slug, name, years }));
  return (
    <main className="container-page max-w-2xl flex-1 py-12">
      <h1 className="text-2xl font-bold md:text-3xl">Зар нэмэх</h1>
      <p className="mt-1 text-slate-600">Батерей, модуль эсвэл засвар үйлчилгээгээ зарлаарай.</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
        <ListingForm models={models} />
      </div>
    </main>
  );
}
