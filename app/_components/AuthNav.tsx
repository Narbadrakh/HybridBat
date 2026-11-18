"use client";

// Нэвтэрсэн эсэхийг browser дээр шалгана. Сервер дээр шалгавал бүх хуудас
// dynamic болж, ISR (статик + 60с шинэчлэлт) алдагдана.
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

export function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <span className="inline-block h-7 w-16" aria-hidden />;
  if (isSignedIn) {
    return (
      <span className={mobile ? "flex items-center gap-2 px-3 py-2 text-sm" : "flex items-center"}>
        <UserButton />
        {mobile && "Миний бүртгэл"}
      </span>
    );
  }
  return (
    <Link
      href="/sign-in"
      className={mobile ? "block rounded-lg px-3 py-2 text-sm hover:bg-slate-100" : "hover:text-[#138a6e]"}
    >
      Нэвтрэх
    </Link>
  );
}
