"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CourseType, PricingModel } from "@/src/types/course";
import { CATEGORIES_DATA } from "@/src/lib/taxonomy";
import { getPublicUploadUrl, nexieraApi, type ApiClass, type ApiAd } from "@/src/lib/api";
import { ClassCard } from "./ClassCard";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  GraduationCap,
  Landmark,
  Layers,
  RotateCcw,
  Search,
  X,
  Rocket,
  Handshake,
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

export function CourseCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [courses, setCourses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedSideBanners, setLoadedSideBanners] = useState({ left: false, right: false });
  const sideBannerRefs = useRef<{ left: HTMLImageElement | null; right: HTMLImageElement | null }>({ left: null, right: null });
  const [sideAds, setSideAds] = useState<ApiAd[]>([]);
  const [sideAdIndex, setSideAdIndex] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseRequestOpen, setCourseRequestOpen] = useState(false);
  const [courseRequestTitle, setCourseRequestTitle] = useState("");
  const [courseRequestMessage, setCourseRequestMessage] = useState("");
  const [courseRequestBusy, setCourseRequestBusy] = useState(false);

  const [campusFilter, setCampusFilter] = useState("ALL");
  const [mainCategoryFilter, setMainCategoryFilter] = useState(initialCategory);
  const [majorFilter, setMajorFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");

  const [typeFilter, setTypeFilter] = useState<"ALL" | CourseType>("ALL");
  const [pricingFilter, setPricingFilter] = useState<"ALL" | PricingModel>("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const campusOptions = useMemo(
    () => Array.from(new Set(courses.map((course) => course.campusTarget || course.university).filter((campus): campus is string => Boolean(campus)))).sort((a, b) => a.localeCompare(b, "id")),
    [courses],
  );


  const marginAdLeft = "/Banner_Samping_Kiri.webp";
  const marginAdRight = "/Banner_Samping_Kanan.webp";

  useEffect(() => {
    let active = true;
    void nexieraApi.adsSlot("SIDE_MARGIN").then(({ ads }) => {
      if (!active) return;
      setSideAds(ads.filter((ad) => ad.status === "APPROVED" && ad.placement === "SIDE_MARGIN").slice(0, 3));
      setSideAdIndex(0);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (sideAds.length < 2) return;
    const timer = window.setInterval(() => {
      setSideAdIndex((index) => (index + 1) % sideAds.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [sideAds.length]);

  const activeSideAd = sideAds[sideAdIndex];
  const activeSideImage = activeSideAd
    ? activeSideAd.imageUrl.startsWith("http") ? activeSideAd.imageUrl : getPublicUploadUrl(activeSideAd.imageUrl)
    : null;

  useEffect(() => {
    setLoadedSideBanners({ left: false, right: false });
  }, [sideAdIndex, activeSideImage]);

  useEffect(() => {
    const loaded = {
      left: sideBannerRefs.current.left?.complete ?? false,
      right: sideBannerRefs.current.right?.complete ?? false,
    };
    if (loaded.left || loaded.right) {
      setLoadedSideBanners((current) => ({
        left: current.left || loaded.left,
        right: current.right || loaded.right,
      }));
    }
  }, [sideAdIndex, activeSideImage]);

  useEffect(() => {
    if (activeSideAd) void nexieraApi.trackAdImpression(activeSideAd.id).catch(() => undefined);
  }, [activeSideAd?.id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    void nexieraApi
      .classes()
      .then((items) => {
        if (active) setCourses(Array.isArray(items) ? items : []);
      })
      .catch((cause) => {
        if (!active) return;
        setCourses([]);
        setLoadError(cause instanceof Error ? cause.message : "Katalog kelas gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setMainCategoryFilter(cat);
      setMajorFilter("ALL");
      setSubjectFilter("ALL");
    }
  }, [searchParams]);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, campusFilter, mainCategoryFilter, majorFilter, subjectFilter, typeFilter, pricingFilter]);

  const availableMajors = useMemo(() => {
    const catalogMajors = courses
      .filter((course) => mainCategoryFilter === "ALL" || (course.category || course.mainCategory) === mainCategoryFilter)
      .map((course) => course.major)
      .filter((major): major is string => Boolean(major?.trim()));
    const knownMajors = mainCategoryFilter !== "ALL" && CATEGORIES_DATA[mainCategoryFilter]
      ? Object.keys(CATEGORIES_DATA[mainCategoryFilter])
      : Object.values(CATEGORIES_DATA).flatMap((majors) => Object.keys(majors));
    return Array.from(new Set([...knownMajors, ...catalogMajors])).sort((a, b) => a.localeCompare(b, "id"));
  }, [courses, mainCategoryFilter]);

  const availableSubjects = useMemo(() => {
    const matchingCourses = courses.filter((course) => {
      const category = course.category || course.mainCategory || "";
      if (mainCategoryFilter !== "ALL" && category !== mainCategoryFilter) return false;
      if (majorFilter !== "ALL" && course.major !== majorFilter) return false;
      return true;
    }).map((course) => course.title);
    const knownSubjects = mainCategoryFilter !== "ALL"
      ? Object.entries(CATEGORIES_DATA[mainCategoryFilter] || {})
          .filter(([major]) => majorFilter === "ALL" || major === majorFilter)
          .flatMap(([, subjects]) => subjects)
      : [];
    return Array.from(new Set([...knownSubjects, ...matchingCourses])).sort((a, b) => a.localeCompare(b, "id"));
  }, [courses, mainCategoryFilter, majorFilter]);

  const handleResetFilter = () => {
    setSearchQuery("");
    setCampusFilter("ALL");
    setMainCategoryFilter("ALL");
    setMajorFilter("ALL");
    setSubjectFilter("ALL");
    setTypeFilter("ALL");
    setPricingFilter("ALL");
    setCurrentPage(1);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = (course.shortDescription || course.description).toLowerCase().includes(query);
        const organizerOrTutor = course.organizerName || course.creator?.name || course.tutor?.name || "";
        const matchesOrganizer = organizerOrTutor.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesOrganizer) {
          return false;
        }
      }

      if (campusFilter !== "ALL") {
        const courseCampus = course.campusTarget || course.university || "";
        if (!courseCampus.toLowerCase().includes(campusFilter.toLowerCase())) {
          return false;
        }
      }

      if (mainCategoryFilter !== "ALL") {
        const courseCategory = course.category || course.mainCategory || "";
        if (courseCategory !== mainCategoryFilter) {
          return false;
        }
      }

      if (majorFilter !== "ALL" && course.major !== majorFilter) return false;

      if (subjectFilter !== "ALL") {
        if (!course.title.toLowerCase().includes(subjectFilter.toLowerCase())) {
          return false;
        }
      }


      if (typeFilter !== "ALL") {
        const actualType = (course.type || course.courseType || "").toUpperCase();
        if (typeFilter === "BOOTCAMP" && actualType !== "BOOTCAMP") {
          return false;
        }
        if (typeFilter === "PEER_TUTORING" && actualType !== "PEER_TUTORING") {
          return false;
        }
      }

      if (pricingFilter !== "ALL") {
        const isFree = Number(course.price) === 0;
        if (pricingFilter === "FREE" && !isFree) return false;
        if (pricingFilter === "PAID" && isFree) return false;
      }

      return true;
    });
  }, [courses, searchQuery, campusFilter, mainCategoryFilter, majorFilter, subjectFilter, typeFilter, pricingFilter]);


  const totalItems = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  return (
    <div className="w-full py-6">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 px-4 sm:px-6 lg:px-8 min-[900px]:grid-cols-[clamp(80px,11vw,160px)_minmax(0,1fr)_clamp(80px,11vw,160px)]">
        <aside aria-label="Iklan samping kiri" className="sticky top-24 hidden h-fit min-w-0 self-start min-[900px]:block">
          <div className="relative aspect-[160/600] w-full overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-white shadow-xs dark:border-[#343945] dark:bg-[#191C23]">
            {!loadedSideBanners.left && <div aria-hidden="true" className="skeleton-shimmer absolute inset-0" />}
            <a className="absolute inset-0" href={activeSideAd?.targetUrl || "/cari-kelas"} target={activeSideAd ? "_blank" : undefined} rel={activeSideAd ? "noreferrer" : undefined} onClick={() => { if (activeSideAd) void nexieraApi.trackAdClick(activeSideAd.id).catch(() => undefined); }}>
              <img
                ref={(image) => { sideBannerRefs.current.left = image; }}
                src={activeSideImage || marginAdLeft}
                alt={activeSideAd?.subtitle || activeSideAd?.title || "Promo Banner NEXIERA"}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setLoadedSideBanners((loaded) => ({ ...loaded, left: true }))}
                onError={() => setLoadedSideBanners((loaded) => ({ ...loaded, left: true }))}
                className="h-full w-full object-cover"
              />
            </a>
          </div>
        </aside>

        <main className="relative z-0 mx-auto w-full min-w-0 min-[1640px]:max-w-[1180px]">

          <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 shadow-xs dark:border-[#343945] dark:bg-[#191C23]">
            <div className="flex flex-col gap-3">

              <div className="flex flex-1 items-center gap-2.5 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 transition-colors focus-within:border-[#2457C5] dark:border-[#343945] dark:bg-[#111318]">
                <Search className="h-4 w-4 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari mata kuliah, misalnya Struktur Data atau Sistem Basis Data"
                  className="w-full bg-transparent text-xs sm:text-sm text-[#20232B] outline-none placeholder:text-[#626B78] dark:text-[#F3F4F6] dark:placeholder:text-[#B1B7C3]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-[#626B78] hover:text-[#20232B] dark:text-[#B1B7C3] dark:hover:text-[#F3F4F6]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>


              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">

                <div className="relative">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3] mb-1 block">
                    1. Kampus
                  </label>
                  <div className="relative">
                    <Landmark className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626B78] dark:text-[#B1B7C3]" />
                    <select
                      value={campusFilter}
                      onChange={(e) => setCampusFilter(e.target.value)}
                      className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-[#20232B] outline-none focus:border-[#2457C5] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                    >
                      <option value="ALL">Semua Kampus</option>
                      {campusOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626B78] dark:text-[#B1B7C3]" />
                  </div>
                </div>


                <div className="relative">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3] mb-1 block">
                    2. Kategori Utama
                  </label>
                  <div className="relative">
                    <Layers className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626B78] dark:text-[#B1B7C3]" />
                    <select
                      value={mainCategoryFilter}
                      onChange={(e) => {
                        setMainCategoryFilter(e.target.value);
                        setMajorFilter("ALL");
                        setSubjectFilter("ALL");
                      }}
                      className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-[#20232B] outline-none focus:border-[#2457C5] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                    >
                      <option value="ALL">Semua Kategori</option>
                      {Object.keys(CATEGORIES_DATA).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626B78] dark:text-[#B1B7C3]" />
                  </div>
                </div>


                <div className="relative">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3] mb-1 block">
                    3. Jurusan
                  </label>
                  <div className="relative">
                    <GraduationCap className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626B78] dark:text-[#B1B7C3]" />
                    <select
                      value={majorFilter}
                      onChange={(e) => {
                        setMajorFilter(e.target.value);
                        setSubjectFilter("ALL");
                      }}
                      className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-[#20232B] outline-none focus:border-[#2457C5] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                    >
                      <option value="ALL">Semua Jurusan</option>
                      {availableMajors.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626B78] dark:text-[#B1B7C3]" />
                  </div>
                </div>


                <div className="relative">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3] mb-1 block">
                    4. Mata Kuliah
                  </label>
                  <div className="relative">
                    <BookOpen className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626B78] dark:text-[#B1B7C3]" />
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-[#20232B] outline-none focus:border-[#2457C5] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                    >
                      <option value="ALL">Semua Mata Kuliah</option>
                      {availableSubjects.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626B78] dark:text-[#B1B7C3]" />
                  </div>
                </div>
              </div>
            </div>


            <div className="mt-3.5 flex flex-col gap-2.5 border-t border-[#D9DEE7] pt-2.5 sm:flex-row sm:items-center sm:justify-between dark:border-[#343945]">
              <div className="flex flex-wrap items-center gap-2">

                <div className="inline-flex rounded-[4px] border border-[#D9DEE7] bg-white p-0.5 dark:border-[#343945] dark:bg-[#111318]">
                  <button
                    type="button"
                    onClick={() => setTypeFilter("ALL")}
                    className={`rounded-[4px] px-2.5 py-1 text-xs font-medium transition-colors ${
                      typeFilter === "ALL"
                        ? "bg-[#2457C5] text-white"
                        : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                    }`}
                  >
                    Semua Tipe
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter("BOOTCAMP")}
                    className={`rounded-[4px] px-2.5 py-1 text-xs font-medium transition-colors ${
                      typeFilter === "BOOTCAMP"
                        ? "bg-[#2457C5] text-white"
                        : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                    }`}
                  >
                    <Rocket className="mr-1 inline h-3 w-3" /> Bootcamp
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter("PEER_TUTORING")}
                    className={`rounded-[4px] px-2.5 py-1 text-xs font-medium transition-colors ${
                      typeFilter === "PEER_TUTORING"
                        ? "bg-[#2457C5] text-white"
                        : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                    }`}
                  >
                    <Handshake className="mr-1 inline h-3 w-3" /> Peer-Tutoring
                  </button>
                </div>


                <div className="inline-flex rounded-[4px] border border-[#D9DEE7] bg-white p-0.5 dark:border-[#343945] dark:bg-[#111318]">
                  <button
                    type="button"
                    onClick={() => setPricingFilter("ALL")}
                    className={`rounded-[4px] px-2.5 py-1 text-xs font-medium transition-colors ${
                      pricingFilter === "ALL"
                        ? "bg-[#2457C5] text-white"
                        : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                    }`}
                  >
                    Semua Biaya
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingFilter("FREE")}
                    className={`rounded-[4px] px-2.5 py-1 text-xs font-medium transition-colors ${
                      pricingFilter === "FREE"
                        ? "bg-[#2457C5] text-white"
                        : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                    }`}
                  >
                    <Check className="mr-1 inline h-3 w-3" /> Gratis
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingFilter("PAID")}
                    className={`rounded-[4px] px-2.5 py-1 text-xs font-medium transition-colors ${
                      pricingFilter === "PAID"
                        ? "bg-[#2457C5] text-white"
                        : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                    }`}
                  >
                    <CreditCard className="mr-1 inline h-3 w-3" /> Berbayar
                  </button>
                </div>


                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-[4px] px-2.5 py-1 text-xs font-medium text-[#2457C5] hover:underline dark:text-[#78A0FF]"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Filter
                </button>
              </div>

              <span className="text-xs text-[#626B78] font-medium dark:text-[#B1B7C3]">
                Total: <strong className="text-[#20232B] dark:text-[#F3F4F6]">{totalItems}</strong> kelas ditemukan
              </span>
            </div>
          </div>


          <div className="mt-6">
            {loading ? (
              <div role="status" aria-label="Memuat daftar kelas" className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-2 xl:grid-cols-3">
                <span className="sr-only">Memuat kelas...</span>
                {Array.from({ length: 6 }, (_, index) => (
                  <article
                    key={index}
                    aria-hidden="true"
                    className="overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-white dark:border-[#343945] dark:bg-[#191C23]"
                  >
                    <div className="skeleton-shimmer h-36 w-full" />
                    <div className="space-y-4 p-4">
                      <div className="flex gap-2">
                        <div className="skeleton-shimmer h-4 w-20 rounded-full" />
                        <div className="skeleton-shimmer h-4 w-14 rounded-full" />
                      </div>
                      <div className="skeleton-shimmer h-5 w-4/5 rounded" />
                      <div className="space-y-2">
                        <div className="skeleton-shimmer h-3 w-full rounded" />
                        <div className="skeleton-shimmer h-3 w-2/3 rounded" />
                      </div>
                      <div className="flex items-center gap-2 border-t border-[#D9DEE7] pt-3 dark:border-[#343945]">
                        <div className="skeleton-shimmer h-8 w-8 shrink-0 rounded-full" />
                        <div className="skeleton-shimmer h-3 w-28 rounded" />
                      </div>
                      <div className="flex items-center justify-between border-t border-[#D9DEE7] pt-3 dark:border-[#343945]">
                        <div className="skeleton-shimmer h-5 w-24 rounded" />
                        <div className="skeleton-shimmer h-8 w-24 rounded" />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : paginatedCourses.length === 0 ? (
              <div className="rounded-[6px] border border-dashed border-[#D9DEE7] bg-white p-12 text-center dark:border-[#343945] dark:bg-[#191C23]">
                <p className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                  Tidak ada kelas yang sesuai dengan kriteria filter Anda.
                </p>
                <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                  Coba sesuaikan kata kunci pencarian atau tekan "Reset Filter".
                </p>
                {searchQuery.trim() && <div className="mt-4"><button type="button" onClick={() => { setCourseRequestTitle(searchQuery.trim()); setCourseRequestOpen((open) => !open); setCourseRequestMessage(""); }} className="btn-secondary cursor-pointer">Ajukan Mata Kuliah Baru</button>{courseRequestOpen && <form className="mx-auto mt-4 grid max-w-md gap-3 text-left" onSubmit={(event) => { event.preventDefault(); setCourseRequestBusy(true); void nexieraApi.requestCourse({ title: courseRequestTitle.trim() }).then(() => { setCourseRequestMessage("Pengajuan mata kuliah tersimpan untuk ditinjau."); setCourseRequestOpen(false); }).catch((error) => setCourseRequestMessage(error instanceof Error ? error.message : "Pengajuan gagal dikirim.")).finally(() => setCourseRequestBusy(false)); }}><label className="text-xs font-semibold">Nama mata kuliah<input required maxLength={160} value={courseRequestTitle} onChange={(event) => setCourseRequestTitle(event.target.value)} className="nx-input mt-1 w-full" /></label><button disabled={courseRequestBusy} className="btn-primary cursor-pointer">{courseRequestBusy ? "Mengirim..." : "Kirim pengajuan"}</button></form>}{courseRequestMessage && <p role="status" className="mt-2 text-xs text-[#2457C5]">{courseRequestMessage}</p>}</div>}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-2 xl:grid-cols-3">
                {paginatedCourses.map((course) => (
                  <ClassCard key={course.id} item={course} />
                ))}
              </div>
            )}


            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-1.5 text-xs font-semibold text-[#20232B] transition-colors hover:bg-[#E5E9F0] disabled:opacity-40 disabled:cursor-not-allowed dark:border-[#343945] dark:bg-[#191C23] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 rounded-[4px] text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-[#2457C5] text-white"
                          : "border border-[#D9DEE7] bg-white text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-1.5 text-xs font-semibold text-[#20232B] transition-colors hover:bg-[#E5E9F0] disabled:opacity-40 disabled:cursor-not-allowed dark:border-[#343945] dark:bg-[#191C23] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                >
                  Selanjutnya <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </main>

        <aside aria-label="Iklan samping kanan" className="sticky top-24 hidden h-fit min-w-0 self-start min-[900px]:block">
          <div className="relative aspect-[160/600] w-full overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-white shadow-xs dark:border-[#343945] dark:bg-[#191C23]">
            {!loadedSideBanners.right && <div aria-hidden="true" className="skeleton-shimmer absolute inset-0" />}
            <a className="absolute inset-0" href={activeSideAd?.targetUrl || "/cari-kelas"} target={activeSideAd ? "_blank" : undefined} rel={activeSideAd ? "noreferrer" : undefined} onClick={() => { if (activeSideAd) void nexieraApi.trackAdClick(activeSideAd.id).catch(() => undefined); }}>
              <img
                ref={(image) => { sideBannerRefs.current.right = image; }}
                src={activeSideImage || marginAdRight}
                alt={activeSideAd?.subtitle || activeSideAd?.title || "Promo Banner NEXIERA"}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setLoadedSideBanners((loaded) => ({ ...loaded, right: true }))}
                onError={() => setLoadedSideBanners((loaded) => ({ ...loaded, right: true }))}
                className="h-full w-full object-cover"
              />
            </a>
          </div>
        </aside>

      </div>
    </div>
  );
}
