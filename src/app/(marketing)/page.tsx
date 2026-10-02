import { Hero } from "@/components/marketing/hero";
import { FeaturedSpaces } from "@/components/marketing/featured-spaces";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { WhyWorkly } from "@/components/marketing/why-workly";
import { FeaturedCities } from "@/components/marketing/featured-cities";
import { OperatorCta } from "@/components/marketing/operator-cta";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedSpaces />
      <HowItWorks />
      <WhyWorkly />
      <FeaturedCities />
      <OperatorCta />
      <Faq />
      <FinalCta />
    </>
  );
}
