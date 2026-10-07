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
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-white">
      <div className="relative mx-auto max-w-4xl px-6 py-10 md:py-14">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-100">
          {SLIDES.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`Iklan promo ${i + 1}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className={`absolute inset-0 object-cover transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
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
          <span className="ml-auto text-xs text-slate-400">
            {index + 1} / {SLIDES.length}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={prev}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
