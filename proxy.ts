import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk-ийн session-ийг хүсэлт бүрт бэлдэнэ. Хамгаалалт энд биш —
// хуудас (auth.protect()) болон Server Action (auth()) бүр өөрөө шалгана.
export default clerkMiddleware();

export const config = {
  matcher: [
    // _next болон статик файлуудыг алгасна
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
