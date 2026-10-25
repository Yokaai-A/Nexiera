"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicUploadUrl, nexieraApi, type ApiAd } from "@/src/lib/api";

type BannerSlide = { id: string; src: string; alt: string; href: string; adId?: string };
const DEFAULT_SLIDE: BannerSlide = {
  id: "nexiera-welcome",
  src: "/Nexiera_Banner_Welcoming.png",
  alt: "Selamat datang di Nexiera. Temukan kelas dan tutor terbaik.",
  href: "/cari-kelas",
};

export function PromoSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<BannerSlide[]>([DEFAULT_SLIDE]);
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({});
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);

  useEffect(() => {
    let active = true;
    void nexieraApi.adsSlot("HOME_HERO").then(({ ads }) => {
      if (!active) return;
      const approvedAds = ads
        .filter((ad) => ad.status === "APPROVED" && ad.placement === "HOME_HERO")
        .slice(0, 4)
        .map((ad: ApiAd) => ({
          id: ad.id,
          adId: ad.id,
          src: ad.imageUrl.startsWith("http") ? ad.imageUrl : getPublicUploadUrl(ad.imageUrl),
          alt: ad.subtitle?.trim() || ad.title,
          href: ad.targetUrl,
        }));
      setSlides([DEFAULT_SLIDE, ...approvedAds]);
      setActiveIndex(0);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const activeImage = imageRefs.current[activeIndex];
    if (activeImage?.complete && activeImage.naturalWidth > 0) {
      setLoadedSlides((loaded) => ({ ...loaded, [activeIndex]: true }));
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    const slide = slides[activeIndex];
    if (slide?.adId) void nexieraApi.trackAdImpression(slide.adId).catch(() => undefined);
  }, [activeIndex, slides]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, slides.length]);

  const showSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  return (
    <section
      aria-label="Banner cari kelas"
      className="w-full bg-white pt-6 pb-3"
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-4 sm:px-6 lg:px-8 min-[900px]:grid-cols-[clamp(72px,9vw,130px)_minmax(0,1fr)_clamp(72px,9vw,130px)]">
        <div aria-hidden="true" className="hidden min-[900px]:block" />
        <div className="min-w-0 min-[1640px]:mx-auto min-[1640px]:max-w-[1180px]">
        <div className="relative aspect-[3/1] w-full overflow-hidden rounded-[6px] bg-white">
          {!loadedSlides[activeIndex] && (
            <div
              role="status"
              aria-label="Memuat banner"
              className="absolute inset-0 z-10 animate-pulse bg-[#E5E9F0]"
            >
              <span className="sr-only">Memuat banner...</span>
              <div className="absolute inset-y-0 left-0 flex w-[48%] flex-col justify-center gap-3 px-[5%]">
                <div className="h-2 w-2/5 rounded-full bg-white/70" />
                <div className="h-5 w-4/5 rounded bg-white/80 sm:h-8" />
                <div className="h-3 w-full rounded-full bg-white/65" />
                <div className="h-3 w-3/4 rounded-full bg-white/65" />
              </div>
              <div className="absolute right-[8%] top-[16%] h-[68%] w-[30%] rounded-[6px] bg-white/55" />
            </div>
          )}
          {slides.map((slide, index) => (
            <a
              key={slide.id}
              href={slide.href}
              target={slide.adId ? "_blank" : undefined}
              rel={slide.adId ? "noreferrer" : undefined}
              aria-label={slide.alt}
              aria-hidden={index !== activeIndex || !loadedSlides[index]}
              onClick={() => { if (slide.adId) void nexieraApi.trackAdClick(slide.adId).catch(() => undefined); }}
              tabIndex={index === activeIndex ? 0 : -1}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === activeIndex && loadedSlides[index] ? "z-20 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <img
                ref={(element) => { imageRefs.current[index] = element; }}
                src={slide.src}
                alt={slide.alt}
                onLoad={() => setLoadedSlides((loaded) => ({ ...loaded, [index]: true }))}
                className="h-full w-full object-cover"
              />
            </a>
          ))}

          <button
            type="button"
            aria-label="Banner sebelumnya"
            onClick={() => showSlide(activeIndex - 1)}
            className="absolute left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#20232B] shadow-md transition-colors hover:bg-white sm:left-2 sm:h-11 sm:w-11"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Banner berikutnya"
            onClick={() => showSlide(activeIndex + 1)}
            className="absolute right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#20232B] shadow-md transition-colors hover:bg-white sm:right-2 sm:h-11 sm:w-11"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2" aria-label={`Slide ${activeIndex + 1} dari ${slides.length}`}>
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Tampilkan slide ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => showSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-12 bg-[#2457C5]" : "w-8 bg-[#D9DEE7] hover:bg-[#AAB4C3]"
              }`}
            />
          ))}
        </div>
        </div>
        <div aria-hidden="true" className="hidden min-[900px]:block" />
      </div>
    </section>
  );
}
