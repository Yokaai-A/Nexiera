"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AcademicCourse, CourseType, PricingModel } from "@/src/types/course";
import { getStoredCourses } from "@/src/lib/storage";
import { ClassCard } from "./ClassCard";
import { BadgeCheck, BookOpenText, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, CreditCard, RotateCcw, Search, X, Rocket, Handshake } from "lucide-react";

export function CourseCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [courses, setCourses] = useState<AcademicCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [campusFilter, setCampusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [typeFilter, setTypeFilter] = useState<"ALL" | CourseType>("ALL");
  const [pricingFilter, setPricingFilter] = useState<"ALL" | PricingModel>("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load courses and subscribe to new course additions from BuatKelasForm
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

  // Update category filter if URL search param changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategoryFilter(cat);
    }
  }, [searchParams]);

  const handleResetFilter = () => {
    setSearchQuery("");
    setCampusFilter("ALL");
    setCategoryFilter("ALL");
    setTypeFilter("ALL");
    setPricingFilter("ALL");
    setVerifiedOnly(false);
    setCurrentPage(1);
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search query (title, description, tags, organizer)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesDesc = course.shortDescription.toLowerCase().includes(query) || course.fullDescription.toLowerCase().includes(query);
        const matchesCategory = course.subjectCategory.toLowerCase().includes(query);
        const matchesOrganizer = course.organizerName.toLowerCase().includes(query);
        const matchesTags = course.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesOrganizer && !matchesTags) {
          return false;
        }
      }

      // Campus filter
      if (campusFilter !== "ALL" && course.university !== campusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== "ALL" && !course.subjectCategory.toLowerCase().includes(categoryFilter.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter !== "ALL" && course.type !== typeFilter) {
        return false;
      }

      // Pricing model filter
      if (pricingFilter !== "ALL" && course.pricingModel !== pricingFilter) {
        return false;
      }

      return true;
    });
  }, [courses, searchQuery, campusFilter, categoryFilter, typeFilter, pricingFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* ── Filter Bar ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Keyword Search */}
          <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari Mata Kuliah: Algorithm, Software Engineering, Kalkulus, Database..."
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
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

          {/* Campus & Category Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:w-[480px]">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <select
                value={campusFilter}
                onChange={(e) => {
                  setCampusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
              >
                <option value="ALL">Semua Kampus</option>
                <option value="BINUS University">BINUS University</option>
                <option value="Universitas Indonesia">Universitas Indonesia (UI)</option>
                <option value="Institut Teknologi Bandung">ITB Bandung</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>

            <div className="relative">
              <BookOpenText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 focus:bg-white"
              >
                <option value="ALL">Semua Bidang Keahlian</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Sains & Teknologi">Sains &amp; Teknologi</option>
                <option value="Ekonomi & Bisnis">Ekonomi &amp; Bisnis</option>
                <option value="Sosial & Hukum">Sosial &amp; Hukum</option>
                <option value="Kesehatan & Kedokteran">Kesehatan &amp; Kedokteran</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Sub Filters: Tipe Kelas & Model Biaya & Reset */}
        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tipe Filter Buttons */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setTypeFilter("ALL")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === "ALL" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua Tipe
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("BOOTCAMP")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === "BOOTCAMP" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Rocket className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Bootcamp
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("PEER_TUTORING")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === "PEER_TUTORING" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Handshake className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Peer-Tutoring
              </button>
            </div>

            {/* Pricing Filter Buttons */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setPricingFilter("ALL")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  pricingFilter === "ALL" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua Biaya
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter("FREE")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  pricingFilter === "FREE" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Check className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Gratis
              </button>
              <button
                type="button"
                onClick={() => setPricingFilter("PAID")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  pricingFilter === "PAID" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <CreditCard className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Berbayar
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

          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
            />
            <span className="inline-flex items-center gap-1"><BadgeCheck className="h-4 w-4 text-blue-600" aria-hidden="true" /> Sertifikasi &amp; Terverifikasi Resmi Kampus</span>
          </label>
        </div>
      </div>

      {/* ── Results Header ───────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Kurikulum Terverifikasi
          </span>
          <h2 className="mt-1 text-2xl font-black text-slate-900">
            Katalog Kelas Akademik &amp; UTS/UAS
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Bimbingan terstruktur 100% mata kuliah kampus untuk persiapan ujian dan praktikum semester.
          </p>
        </div>

        <div className="text-right">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {filteredCourses.length} Kelas Tersedia
          </span>
        </div>
      </div>

      {/* ── Courses Grid ─────────────────────────────────────── */}
      {paginatedCourses.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedCourses.map((course) => (
            <ClassCard key={course.id} item={course} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Search className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.5} aria-hidden="true" />
          <h3 className="mt-3 text-lg font-bold text-slate-900">Tidak ada kelas yang cocok</h3>
          <p className="mt-1 text-xs text-slate-500">
            Coba ubah kata kunci pencarian atau reset filter untuk melihat semua kelas yang tersedia.
          </p>
          <button
            type="button"
            onClick={handleResetFilter}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row shadow-sm">
          <p className="text-xs text-slate-600">
            Menampilkan{" "}
            <span className="font-bold text-slate-900">
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredCourses.length)}
            </span>{" "}
            dari <span className="font-bold text-slate-900">{filteredCourses.length}</span> Kelas
          </p>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
