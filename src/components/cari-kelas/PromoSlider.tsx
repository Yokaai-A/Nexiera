"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  "/banner-cari-kelas.png",
  "/banner-cari-kelas.png",
  "/banner-cari-kelas.png",
];

export function PromoSlider() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="relative mx-auto w-full px-45 py-10 md:py-14">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-100">
          {SLIDES.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`Iklan promo ${i + 1}`}
              width={1200}
              height={400}
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`h-auto w-full transition-opacity duration-700 ${
                i === index ? "relative opacity-100" : "absolute inset-0 opacity-0"
              }`}
            />
          ))}

          <button
            type="button"
            aria-label="Slide sebelumnya"
            onClick={prev}
            className="absolute left-0 top-1/2 z-10 flex h-20 w-10 -translate-y-1/2 items-center justify-center rounded-r-full bg-black/5 text-2xl text-black hover:bg-black/50"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Slide berikutnya"
            onClick={next}
            className="absolute right-0 top-1/2 z-10 flex h-20 w-10 -translate-y-1/2 items-center justify-center rounded-l-full bg-black/5 text-2xl text-black hover:bg-black/50"
          >
            ›
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-6 bg-blue-600" : "w-2.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
