"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    image: "/banner-cari-kelas.png",
    tag: "FEATURED BOOTCAMP",
    title: "BOOTCAMP TERBAIK DARI BOOSTER ACADEMY PRESENTS",
    subtitle: "Kupas Tuntas Seluruh Materi CS Semester 1 - 4 & Bank Soal UTS/UAS Terlengkap",
    ctaLink: "/organizers/booster-academy",
  },
  {
    image: "/banner-cari-kelas.png",
    tag: "PEER TUTORING HIGHLIGHT",
    title: "ALGORITHM DESIGN & ANALYSIS (ADA)",
    subtitle: "Kuasai Dynamic Programming & Graph Algorithms bersama Tutor Berpengalaman",
    ctaLink: "/detail-kelas?id=course-cs-02",
  },
];

export function PromoSlider() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative w-full bg-white pt-6 pb-2">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-[#20232B]">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`transition-opacity duration-500 ${
                i === index ? "relative opacity-100" : "absolute inset-0 opacity-0 pointer-events-none"
              }`}
            >
              <Link href={slide.ctaLink} className="block relative aspect-[21/9] sm:aspect-[24/8] w-full overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={i === 0}
                  className="object-cover object-center brightness-95"
                />
              </Link>
            </div>
          ))}

          <button
            type="button"
            aria-label="Slide sebelumnya"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[4px] bg-white border border-[#D9DEE7] text-[#20232B] hover:bg-[#E5E9F0] transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Slide berikutnya"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[4px] bg-white border border-[#D9DEE7] text-[#20232B] hover:bg-[#E5E9F0] transition-colors"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-[4px] bg-[#20232B]/80 px-2.5 py-1">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-[2px] transition-all ${
                  i === index ? "w-5 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
