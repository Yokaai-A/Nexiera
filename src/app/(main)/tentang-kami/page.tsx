import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenText, Check, Landmark, Target, UsersRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami — NEXIERA",
  description:
    "Cerita di balik NEXIERA, platform bimbingan akademik yang didirikan oleh mahasiswa Universitas Bina Nusantara.",
};

const FOUNDERS = [
  {
    name: "Muhammad Abyan Hanif",
    role: "Chief Executive & Lead System Architect",
    major: "Computer Science, BINUS University",
    bio: "Penggagas visi marketplace bimbingan matkul terpusat. Berfokus pada arsitektur sistem performa tinggi dan skalabilitas ekosistem kampus.",
  },
  {
    name: "Nicholas Aryan",
    role: "Head of Product & Platform Experience",
    major: "Computer Science, BINUS University",
    bio: "Mengorkestrasi desain kurikulum dan pengalaman belajar interaktif yang mempermudah mahasiswa menemukan tutor sebaya terbaik.",
  },
  {
    name: "Clarissa Wijaya",
    role: "Head of Academic Curriculum & Learning Notes",
    major: "Computer Science, BINUS University",
    bio: "Merancang standardisasi catatan kuliah terstruktur dan bank soal persiapan UTS/UAS bagi mahasiswa.",
  },
  {
    name: "Kevin Sanjaya",
    role: "Director of Tutor Community & Partner Network",
    major: "Computer Science, BINUS University",
    bio: "Menghubungkan mitra organisasi seperti Booster Academy dan membina tutor mahasiswa berprestasi lintas kampus.",
  },
  {
    name: "Rizky Pratama",
    role: "Lead Platform Engineer & Security",
    major: "Computer Science, BINUS University",
    bio: "Menjaga keandalan platform, integrasi verifikasi mahasiswa, dan keamanan data peserta bimbingan akademik.",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "100% Khusus Matkul Kampus",
    desc: "Kebutuhan kuliah punya konteks dan tantangannya sendiri. Karena itu, NEXIERA berfokus pada mata kuliah kampus—mulai dari AlgoProg, ADA, Kalkulus, Software Engineering, hingga Basis Data—agar mahasiswa lebih mudah menemukan kelas yang selaras dengan materi yang sedang mereka pelajari.",
  },
  {
    icon: BookOpenText,
    title: "Catatan Belajar Terstruktur",
    desc: "Catatan yang tersusun baik membuat waktu belajar lebih bermakna. Melalui tautan catatan belajar, silabus, rangkuman, dan pembahasan latihan dapat dikumpulkan dalam format yang rapi sehingga mahasiswa bisa kembali ke materi penting tanpa harus mencarinya dari awal.",
  },
  {
    icon: UsersRound,
    title: "Tutor Sebaya yang Relevan",
      desc: "Tutor sebaya memahami ritme dan tantangan perkuliahan dari pengalaman langsung. Kedekatan ini membuka ruang belajar yang lebih cair. Mahasiswa dapat bertanya dengan nyaman, membahas konsep langkah demi langkah, dan melihat materi dari sudut pandang yang lebih dekat dengan keseharian mereka.",
  },
];

export default function TentangKamiPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <section className="relative flex min-h-[calc(100svh-74px)] items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-background py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-4 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
            <Landmark className="h-3.5 w-3.5" aria-hidden="true" /> Didirikan Tahun 2026 di Universitas Bina Nusantara
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            “Dibuat oleh Mahasiswa, <br />
            <span className="text-blue-600">untuk Mahasiswa.”</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-600">
            NEXIERA berangkat dari pengalaman yang akrab bagi banyak mahasiswa <b>BINUS University</b>.
            Mencari tutor yang tepat, memahami materi yang terasa rumit, dan merapikan begitu banyak
            sumber belajar sering kali sama melelahkannya dengan menghadapi kuliah itu sendiri. Kami
            membangun satu ruang belajar yang lebih terarah, agar mahasiswa bisa menemukan dukungan
            akademik dengan lebih mudah dan menggunakan waktunya untuk benar-benar memahami materi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-2 items-center rounded-3xl border border-slate-200/80 bg-white p-8 md:p-12 shadow-sm">
          <div>
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              Latar Belakang &amp; Visi
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              Menyatukan Papan Pengumuman Akademik ke Satu Platform Digital Terpadu
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Di tengah padatnya jadwal kuliah, menemukan bantuan belajar yang relevan sering terasa seperti pekerjaan tambahan. Informasi kelas tersebar, catatan tersimpan di banyak tempat, sementara penjelasan yang dibutuhkan bisa jadi sulit ditemukan tepat saat diperlukan. NEXIERA ingin membuat proses itu lebih sederhana dan terarah.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Karena itu, NEXIERA mempertemukan mahasiswa yang ingin belajar lebih terstruktur dengan tutor sebaya dan penyedia kelas dalam satu platform. Mahasiswa dapat menjelajahi kelas yang sesuai kebutuhan, sementara tutor memiliki ruang untuk membagikan cara belajar, pengalaman, dan pemahaman materi yang mereka kuasai. Kami percaya proses belajar yang baik dimulai dari akses yang lebih mudah dan penjelasan yang terasa dekat.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/cari-kelas"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Jelajahi Kelas Kuliah <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/buat-kelas"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Menjadi Tutor Sebaya
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
            <h3 className="text-xl font-bold">Komitmen Integritas Akademik</h3>
            <p className="mt-3 text-xs leading-relaxed text-blue-100">
              Bagi kami, keberhasilan belajar berarti memahami konsep dan mampu menggunakannya secara mandiri. NEXIERA mendukung diskusi, latihan, rangkuman, dan panduan praktikum sebagai bekal belajar; setiap dukungan akademik harus tetap menghormati proses dan integritas mahasiswa.
            </p>
            <div className="mt-6 space-y-3 border-t border-white/20 pt-4 text-xs font-medium text-blue-50">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5" aria-hidden="true" /> Verifikasi Status Mahasiswa Resmi
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5" aria-hidden="true" /> Review Kurikulum Selaras Silabus Perkuliahan
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5" aria-hidden="true" /> Transparansi Materi Belajar &amp; Tautan Akses
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="text-center mb-8">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Pilar Pembelajaran
          </span>
          <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
            Mengapa NEXIERA Berbeda?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-blue-300 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <v.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center mb-10">
          <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100 uppercase tracking-wide">
            The Team Behind NEXIERA
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">
            5 Founders Mahasiswa BINUS University
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Berawal dari pengalaman sebagai mahasiswa School of Computer Science BINUS University, tim pendiri NEXIERA merancang platform ini dengan satu tujuan. Kami ingin membuat dukungan belajar yang relevan lebih mudah dijangkau, dimulai dari lingkungan kampus sendiri.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDERS.map((f, i) => (
            <div
              key={f.name}
              className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                i === 0 ? "sm:col-span-2 lg:col-span-1 border-blue-200 ring-2 ring-blue-100" : ""
              }`}
            >
              <div className="min-h-20">
                  <h3 className="text-base font-bold text-slate-900">
                    {f.name}
                  </h3>
                  <p className="text-xs font-bold text-blue-600">
                    {f.role}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400">
                    {f.major}
                  </p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-xs leading-relaxed text-slate-600">
                  {f.bio}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified BINUS CS
                </span>
                <span>Founding Team 2026</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pt-6">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Siap Mengamankan Nilai Akademik Semester Ini?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400 leading-relaxed">
            Temukan kelas yang sesuai dengan kebutuhanmu, belajar bersama tutor sebaya, dan susun langkah berikutnya dengan lebih percaya diri. NEXIERA hadir untuk mendampingi proses belajarmu, satu materi dan satu kemajuan pada satu waktu.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/cari-kelas"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
            >
              Cari Kelas Sekarang <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 transition-colors"
            >
              Daftar Akun Mahasiswa
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
