import { Hero } from "@/app/_components/Hero";
import { ModelCards } from "@/app/_components/ModelCards";
import { FeaturedListings } from "@/app/_components/FeaturedListings";
import { HowItWorks } from "@/app/_components/HowItWorks";

// Шинэ зарууд DB-ээс ирдэг тул 60 секунд тутам шинэчилнэ (ISR)
export const revalidate = 60;

export default function Home() {
  return (
    <main>
      <Hero />
      <ModelCards />
      <FeaturedListings />
      <HowItWorks />
    </main>
  );
}
