import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { mnMN } from "@clerk/localizations";
import "./globals.css";
import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HybridBat.mn — Hybrid батерейны засвар, сэлбэг",
  description: "Toyota hybrid батерейны засвар, сэлбэгийн зарыг нэг дороос.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Зурагдахаас өмнө theme-ийг тавина (анивчихгүй). Хадгалсан сонголт, эсвэл системийн тохиргоо. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-slate-900">
        <ClerkProvider
          localization={mnMN}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          appearance={{
            // CSS хувьсагчаар: цайвар / хар theme-д автоматаар таарна
            variables: {
              colorPrimary: "#138a6e",
              colorBackground: "var(--color-surface)",
              colorForeground: "var(--color-slate-900)",
              colorMutedForeground: "var(--color-slate-500)",
              colorInput: "var(--color-surface)",
              colorInputForeground: "var(--color-slate-900)",
              colorNeutral: "var(--color-slate-900)",
              colorBorder: "var(--color-slate-300)",
            },
          }}
        >
          <Header />
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
