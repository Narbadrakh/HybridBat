import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Бүртгүүлэх — HybridBat.mn" };

export default function SignUpPage() {
  return (
    <main className="container-page flex flex-1 justify-center py-16">
      <SignUp />
    </main>
  );
}
