import { Hero } from "@/app/_components/Hero";
import { ModelCards } from "@/app/_components/ModelCards";
import { FeaturedListings } from "@/app/_components/FeaturedListings";
import { HowItWorks } from "@/app/_components/HowItWorks";

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
