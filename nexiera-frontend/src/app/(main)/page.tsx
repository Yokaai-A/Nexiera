import { Hero } from "@/src/components/home/Hero";
import { KeyBenefits } from "@/src/components/home/KeyBenefits";
import { Categories } from "@/src/components/home/Categories";
import { WhyNexiera } from "@/src/components/home/WhyNexiera";
import { TutorCta } from "@/src/components/home/TutorCta";
import { Reveal } from "@/src/components/ui/ScrollReveal";

export default function Home() {
  return (
    <>
      <Reveal immediate duration={700} y={20}>
        <Hero />
      </Reveal>
      <Reveal duration={650} y={24}>
        <KeyBenefits />
      </Reveal>
      <Reveal duration={650} y={24}>
        <Categories />
      </Reveal>
      <Reveal duration={650} y={24}>
        <WhyNexiera />
      </Reveal>
      <Reveal duration={650} y={24}>
        <TutorCta />
      </Reveal>
    </>
  );
}
