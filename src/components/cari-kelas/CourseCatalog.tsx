"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AcademicCourse, CourseType, PricingModel } from "@/src/types/course";
import { getStoredCourses } from "@/src/lib/storage";
import { CATEGORIES_DATA } from "@/src/lib/mockData";
import { ClassCard } from "./ClassCard";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  GraduationCap,
  Layers,
  RotateCcw,
  Search,
  X,
  Rocket,
  Handshake,
} from "lucide-react";

export function CourseCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [courses, setCourses] = useState<AcademicCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [mainCategoryFilter, setMainCategoryFilter] = useState(initialCategory);
  const [majorFilter, setMajorFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");

  const [typeFilter, setTypeFilter] = useState<"ALL" | CourseType>("ALL");
  const [pricingFilter, setPricingFilter] = useState<"ALL" | PricingModel>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCourses(getStoredCourses());

    const handleCoursesChange = () => {
      setCourses(getStoredCourses());
    };

    window.addEventListener("nexiera_course_update", handleCoursesChange);
    return () => {
      window.removeEventListener("nexiera_course_update", handleCoursesChange);
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
        const matchesDesc =
          course.shortDescription?.toLowerCase().includes(query) ||
          course.fullDescription?.toLowerCase().includes(query);
        const matchesOrganizer = course.organizerName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesOrganizer) {
          return false;
        }
      }

      if (mainCategoryFilter !== "ALL") {
        const courseCategory = course.mainCategory || course.subjectCategory || "";
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

      if (typeFilter !== "ALL" && course.type !== typeFilter) {
        return false;
      }

      if (pricingFilter !== "ALL" && course.pricingModel !== pricingFilter) {
        return false;
      }

      return true;
    });
  }, [courses, searchQuery, mainCategoryFilter, majorFilter, subjectFilter, typeFilter, pricingFilter]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">

        <div className="flex flex-col gap-3">
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Mata Kuliah: Algorithm, Software Engineering, Database, Manajemen Keuangan..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                1. Kategori Utama
              </label>
              <div className="relative">
                <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <select
                  value={mainCategoryFilter}
                  onChange={(e) => {
                    setMainCategoryFilter(e.target.value);
                    setMajorFilter("ALL");
                    setSubjectFilter("ALL");
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                >
                  <option value="ALL">Semua Kategori Utama</option>
                  {Object.keys(CATEGORIES_DATA).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                2. Jurusan
              </label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <select
                  value={majorFilter}
                  onChange={(e) => {
                    setMajorFilter(e.target.value);
                    setSubjectFilter("ALL");
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                >
                  <option value="ALL">Semua Jurusan</option>
                  {availableMajors.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                3. Mata Kuliah
              </label>
              <div className="relative">
                <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-all"
                >
                  <option value="ALL">Semua Mata Kuliah</option>
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setTypeFilter("ALL")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === "ALL" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua Tipe
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("BOOTCAMP")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === "BOOTCAMP" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Rocket className="mr-1 inline h-3 w-3" aria-hidden="true" /> Bootcamp
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("PEER_TUTORING")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === "PEER_TUTORING" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Handshake className="mr-1 inline h-3 w-3" aria-hidden="true" /> Peer-Tutoring
              </button>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setPricingFilter("ALL")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  pricingFilter === "ALL" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua Biaya
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter("FREE")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  pricingFilter === "FREE" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Check className="mr-1 inline h-3 w-3" aria-hidden="true" /> Gratis
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter("PAID")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  pricingFilter === "PAID" ? "bg-slate-800 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <CreditCard className="mr-1 inline h-3 w-3" aria-hidden="true" /> Berbayar
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetFilter}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> RESET FILTER
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-800">{filteredCourses.length}</strong> kelas akademik
          </span>
        </div>
      </div>

      <div className="mt-8">
        {filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <h3 className="text-base font-bold text-slate-800">Tidak ada kelas yang cocok</h3>
            <p className="mt-1 text-xs text-slate-500">
              Coba sesuaikan kombinasi Kategori Utama, Jurusan, atau kata kunci pencarian kamu.
            </p>
            <button
              type="button"
              onClick={handleResetFilter}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCourses.map((course) => (
              <ClassCard key={course.id} item={course} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
