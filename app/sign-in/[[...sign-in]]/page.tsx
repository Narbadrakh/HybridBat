import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Нэвтрэх — HybridBat.mn" };

export default function SignInPage() {
  return (
    <main className="container-page flex flex-1 justify-center py-16">
      <SignIn />
    </main>
  );
}
