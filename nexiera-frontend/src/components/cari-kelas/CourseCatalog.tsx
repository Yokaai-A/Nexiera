"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CourseType, PricingModel } from "@/src/types/course";
import { CATEGORIES_DATA } from "@/src/lib/taxonomy";
import { nexieraApi, type ApiClass, type ApiAd } from "@/src/lib/api";
import { ClassCard } from "./ClassCard";
import {
  BookOpen,
  Check,
  ChevronDown,
  CreditCard,
  GraduationCap,
  Landmark,
  Layers,
  RotateCcw,
  Search,
  X,
  Rocket,
  Handshake,
  Sparkles,
} from "lucide-react";

const CAMPUS_OPTIONS = [
  "BINUS University",
  "Universitas Indonesia",
  "Institut Teknologi Bandung",
  "Universitas Gadjah Mada",
];

export function CourseCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [courses, setCourses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [campusFilter, setCampusFilter] = useState("ALL");
  const [mainCategoryFilter, setMainCategoryFilter] = useState(initialCategory);
  const [majorFilter, setMajorFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");

  const [typeFilter, setTypeFilter] = useState<"ALL" | CourseType>("ALL");
  const [pricingFilter, setPricingFilter] = useState<"ALL" | PricingModel>("ALL");

  // Catalog Ad Slot
  const [catalogAd, setCatalogAd] = useState<(ApiAd & { official?: boolean }) | null>(null);

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

    void nexieraApi
      .adsSlot("CLASS_CATALOG")
      .then(({ ads }) => {
        if (active && ads.length > 0) {
          setCatalogAd(ads[0]);
          if (!ads[0].official) {
            void nexieraApi.trackAdImpression(ads[0].id).catch(() => undefined);
          }
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setMainCategoryFilter(cat);
      setMajorFilter("ALL");
      setSubjectFilter("ALL");
    }
  }, [searchParams]);

  const availableMajors = useMemo(() => {
    if (mainCategoryFilter !== "ALL" && CATEGORIES_DATA[mainCategoryFilter]) {
      return Object.keys(CATEGORIES_DATA[mainCategoryFilter]);
    }
    const allMajors = new Set<string>();
    Object.values(CATEGORIES_DATA).forEach((majorsObj) => {
      Object.keys(majorsObj).forEach((m) => allMajors.add(m));
    });
    return Array.from(allMajors);
  }, [mainCategoryFilter]);

  const availableSubjects = useMemo(() => {
    if (mainCategoryFilter !== "ALL" && majorFilter !== "ALL") {
      return CATEGORIES_DATA[mainCategoryFilter]?.[majorFilter] || [];
    }
    if (majorFilter !== "ALL") {
      for (const cat of Object.keys(CATEGORIES_DATA)) {
        if (CATEGORIES_DATA[cat][majorFilter]) {
          return CATEGORIES_DATA[cat][majorFilter];
        }
      }
    }
    if (mainCategoryFilter !== "ALL" && CATEGORIES_DATA[mainCategoryFilter]) {
      const subjects: string[] = [];
      Object.values(CATEGORIES_DATA[mainCategoryFilter]).forEach((list) => {
        subjects.push(...list);
      });
      return Array.from(new Set(subjects));
    }
    return Array.from(new Set(courses.map((c) => c.title)));
  }, [mainCategoryFilter, majorFilter, courses]);

  const handleResetFilter = () => {
    setSearchQuery("");
    setCampusFilter("ALL");
    setMainCategoryFilter("ALL");
    setMajorFilter("ALL");
    setSubjectFilter("ALL");
    setTypeFilter("ALL");
    setPricingFilter("ALL");
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = (course.shortDescription || course.description).toLowerCase().includes(query);
        const matchesOrganizer = (course.organizerName || course.tutor.name).toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesOrganizer) {
          return false;
        }
      }

      if (campusFilter !== "ALL") {
        const courseCampus = course.university || "";
        if (courseCampus.toLowerCase() !== campusFilter.toLowerCase()) {
          return false;
        }
      }

      if (mainCategoryFilter !== "ALL") {
        const courseCategory = course.mainCategory || "";
        if (courseCategory.toLowerCase() !== mainCategoryFilter.toLowerCase()) {
          return false;
        }
      }

      if (majorFilter !== "ALL") {
        const courseMajor = course.major || "";
        if (courseMajor.toLowerCase() !== majorFilter.toLowerCase()) {
          return false;
        }
      }

      if (subjectFilter !== "ALL") {
        if (!course.title.toLowerCase().includes(subjectFilter.toLowerCase())) {
          return false;
        }
      }

      if (typeFilter !== "ALL" && course.courseType !== typeFilter) {
        return false;
      }

      if (pricingFilter !== "ALL" && (Number(course.price) === 0 ? "FREE" : "PAID") !== pricingFilter) {
        return false;
      }

      return true;
    });
  }, [courses, searchQuery, campusFilter, mainCategoryFilter, majorFilter, subjectFilter, typeFilter, pricingFilter]);

  // The Cari Kelas landing catalog intentionally features one class per price
  // model. The API returns newest classes first, so new listings replace the
  // featured class in their free/paid slot.
  const catalogCourses = useMemo(() => {
    const paidCourse = filteredCourses.find((course) => Number(course.price) > 0);
    const freeCourse = filteredCourses.find((course) => Number(course.price) === 0);
    return [paidCourse, freeCourse].filter((course): course is ApiClass => Boolean(course));
  }, [filteredCourses]);

  return (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-6">
      {/* Filter Box */}
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3">
          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2.5 rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2.5 transition-colors focus-within:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800">
            <Search className="h-4 w-4 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Cari Mata Kuliah: Algorithm, Data Structures, Software Engineering, Kalkulus, Akuntansi..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#20232B] outline-none placeholder:text-[#626B78] dark:text-slate-100 dark:placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#626B78] hover:text-[#20232B] dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* 4-Level Dropdown Hierarchy (Kampus -> Kategori -> Jurusan -> Matkul) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Level 1: Kampus */}
            <div className="relative">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-slate-400 mb-1 block">
                1. Kampus
              </label>
              <div className="relative">
                <Landmark className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
                <select
                  value={campusFilter}
                  onChange={(e) => {
                    setCampusFilter(e.target.value);
                  }}
                  className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white py-2.5 pl-9 pr-8 text-xs font-medium text-[#20232B] outline-none transition-colors focus:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">Semua Kampus</option>
                  {CAMPUS_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
              </div>
            </div>

            {/* Level 2: Kategori Utama */}
            <div className="relative">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-slate-400 mb-1 block">
                2. Kategori Utama
              </label>
              <div className="relative">
                <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
                <select
                  value={mainCategoryFilter}
                  onChange={(e) => {
                    setMainCategoryFilter(e.target.value);
                    setMajorFilter("ALL");
                    setSubjectFilter("ALL");
                  }}
                  className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white py-2.5 pl-9 pr-8 text-xs font-medium text-[#20232B] outline-none transition-colors focus:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">Semua Kategori Utama</option>
                  {Object.keys(CATEGORIES_DATA).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
              </div>
            </div>

            {/* Level 3: Jurusan */}
            <div className="relative">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-slate-400 mb-1 block">
                3. Jurusan
              </label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
                <select
                  value={majorFilter}
                  onChange={(e) => {
                    setMajorFilter(e.target.value);
                    setSubjectFilter("ALL");
                  }}
                  className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white py-2.5 pl-9 pr-8 text-xs font-medium text-[#20232B] outline-none transition-colors focus:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">Semua Jurusan</option>
                  {availableMajors.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
              </div>
            </div>

            {/* Level 4: Mata Kuliah */}
            <div className="relative">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-slate-400 mb-1 block">
                4. Mata Kuliah
              </label>
              <div className="relative">
                <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                  }}
                  className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white py-2.5 pl-9 pr-8 text-xs font-medium text-[#20232B] outline-none transition-colors focus:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">Semua Mata Kuliah</option>
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78] dark:text-slate-400" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Baris Bawah: Tipe, Biaya, Reset */}
        <div className="mt-4 flex flex-col gap-3 border-t border-[#D9DEE7] pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tipe Kelas */}
            <div className="inline-flex rounded-[4px] border border-[#D9DEE7] bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setTypeFilter("ALL")}
                className={`rounded-[4px] px-3 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === "ALL"
                    ? "bg-[#2457C5] text-white"
                    : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Semua Tipe
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("BOOTCAMP")}
                className={`rounded-[4px] px-3 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === "BOOTCAMP"
                    ? "bg-[#2457C5] text-white"
                    : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Rocket className="mr-1 inline h-3 w-3" aria-hidden="true" /> Bootcamp
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("PEER_TUTORING")}
                className={`rounded-[4px] px-3 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === "PEER_TUTORING"
                    ? "bg-[#2457C5] text-white"
                    : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Handshake className="mr-1 inline h-3 w-3" aria-hidden="true" /> Peer-Tutoring
              </button>
            </div>

            {/* Biaya Kelas */}
            <div className="inline-flex rounded-[4px] border border-[#D9DEE7] bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setPricingFilter("ALL")}
                className={`rounded-[4px] px-3 py-1.5 text-xs font-medium transition-colors ${
                  pricingFilter === "ALL"
                    ? "bg-[#2457C5] text-white"
                    : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Semua Biaya
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter("FREE")}
                className={`rounded-[4px] px-3 py-1.5 text-xs font-medium transition-colors ${
                  pricingFilter === "FREE"
                    ? "bg-[#2457C5] text-white"
                    : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Check className="mr-1 inline h-3 w-3" aria-hidden="true" /> Gratis
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter("PAID")}
                className={`rounded-[4px] px-3 py-1.5 text-xs font-medium transition-colors ${
                  pricingFilter === "PAID"
                    ? "bg-[#2457C5] text-white"
                    : "text-[#20232B] hover:bg-[#E5E9F0] dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <CreditCard className="mr-1 inline h-3 w-3" aria-hidden="true" /> Berbayar
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilter}
              className="inline-flex items-center gap-1 rounded-[4px] px-3 py-1.5 text-xs font-medium text-[#2457C5] hover:underline transition-colors dark:text-[#78A0FF]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset Filter
            </button>
          </div>

          <span className="text-xs text-[#626B78] font-medium dark:text-slate-400">
            Menampilkan <strong className="text-[#20232B] font-semibold dark:text-slate-100">{catalogCourses.length}</strong> kelas akademik
          </span>
        </div>
      </div>

      {/* Grid Kelas */}
      <div className="mt-8">
        {loading ? (
          <div role="status" aria-label="Memuat kelas" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <span className="sr-only">Memuat kelas akademik yang tersedia...</span>
            {Array.from({ length: 2 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="animate-pulse rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-[#E5E9F0] dark:bg-slate-800" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                      <div className="h-2.5 w-1/2 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="h-6 w-24 shrink-0 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                </div>
                <div className="mt-4 border-t border-[#D9DEE7] pt-4 dark:border-slate-800">
                  <div className="h-2.5 w-1/3 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                  <div className="mt-2 h-4 w-4/5 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                  <div className="mt-2 h-3 w-full rounded bg-[#E5E9F0] dark:bg-slate-800" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                </div>
                <div className="mt-4 h-10 rounded bg-[#E5E9F0]/70 dark:bg-slate-800/70" />
                <div className="mt-4 flex items-center justify-between border-t border-[#D9DEE7] pt-4 dark:border-slate-800">
                  <div className="space-y-2">
                    <div className="h-2 w-16 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                    <div className="h-4 w-24 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                  </div>
                  <div className="h-8 w-28 rounded bg-[#E5E9F0] dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-[6px] border border-red-200 bg-white p-8 text-center dark:border-red-900/50 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-[#20232B] dark:text-slate-100">Katalog kelas belum dapat dimuat</h3>
            <p role="alert" className="mt-1 text-sm text-[#626B78] dark:text-slate-400">{loadError}</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-primary mt-4">
              Coba lagi
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-[#20232B] dark:text-slate-100">
              {courses.length === 0 ? "Belum ada kelas yang tersedia" : "Tidak ada kelas yang cocok"}
            </h3>
            <p className="mt-1 text-xs text-[#626B78] dark:text-slate-400">
              {courses.length === 0
                ? "Kelas yang sudah dipublikasikan pengajar akan muncul di sini."
                : "Coba sesuaikan kampus, kategori utama, jurusan, atau kata kunci pencarian kamu."}
            </p>
            {courses.length > 0 && (
              <button type="button" onClick={handleResetFilter} className="mt-4 btn-primary">
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {catalogCourses.map((course) => (
              <ClassCard key={course.id} item={course} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
