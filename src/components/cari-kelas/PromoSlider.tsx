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
    ctaLink: "/detail-kelas?id=course-cs-01",
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
    <section className="relative w-full bg-background pt-6 pb-4">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative w-full overflow-hidden rounded-3xl shadow-sm ring-1 ring-slate-200/80 bg-slate-900">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`transition-opacity duration-700 ${
                i === index ? "relative opacity-100" : "absolute inset-0 opacity-0 pointer-events-none"
              }`}
            >
              <Link href={slide.ctaLink} className="block relative aspect-[21/9] sm:aspect-[24/8] w-full overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={i === 0}
                  className="object-cover object-center brightness-95 hover:scale-[1.01] transition-transform duration-500"
                />
              </Link>
            </div>
          ))}

          <button
            type="button"
            aria-label="Slide sebelumnya"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-800 shadow-md hover:bg-white transition-all"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Slide berikutnya"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-800 shadow-md hover:bg-white transition-all"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-sm px-3 py-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
