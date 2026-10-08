import { Hero } from "@/src/components/home/Hero";
import { Categories } from "@/src/components/home/Categories";
import { WhyNexiera } from "@/src/components/home/WhyNexiera";
import { TutorCta } from "@/src/components/home/TutorCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyNexiera />
      <TutorCta />
    </>
  );
}
