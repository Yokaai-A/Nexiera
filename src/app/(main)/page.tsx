import { Hero } from "@/src/components/home/Hero";
import { KeyBenefits } from "@/src/components/home/KeyBenefits";
import { Categories } from "@/src/components/home/Categories";
import { WhyNexiera } from "@/src/components/home/WhyNexiera";
import { TutorCta } from "@/src/components/home/TutorCta";

export default function Home() {
  return (
    <>
      <Hero />
      <KeyBenefits />
      <Categories />
      <WhyNexiera />
      <TutorCta />
    </>
  );
}
