import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Check, Landmark, Target, UsersRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami — NEXIERA",
  description:
    "Cerita di balik NEXIERA, platform bimbingan akademik yang didirikan oleh mahasiswa Universitas Bina Nusantara.",
};

const FOUNDERS = [
  {
    name: "Muhammad Abyan Hanif",
    role: "Chief Executive Officer (CEO)",
    major: "Computer Science, BINUS University",
    bio: "Memimpin arah strategis platform, arsitektur produk bimbingan akademik, serta perancangan ekosistem belajar terarah bagi mahasiswa.",
  },
  {
    name: "Nicholas Carlen",
    role: "Chief Finance Officer (CFO)",
    major: "Computer Science, BINUS University",
    bio: "Bertanggung jawab atas tata kelola keuangan, struktur biaya pembelajaran, dan keberlanjutan model operasional platform NEXIERA.",
  },
  {
    name: "Cornelia Jovita Putri Pramesti",
    role: "Chief Marketing Officer (CMO)",
    major: "Computer Science, BINUS University",
    bio: "Mengelola strategi komunikasi, engagement komunitas mahasiswa, serta memperluas jangkauan bimbingan belajar antarkampus.",
  },
  {
    name: "Muhammad Afif Syauqi",
    role: "Chief Technology Officer (CTO)",
    major: "Computer Science, BINUS University",
    bio: "Mengembangkan infrastruktur aplikasi, stabilitas sistem bimbingan, serta menjamin keandalan dan keamanan akses pembelajaran.",
  },
  {
    name: "Alexander Vian Hardjowibowo",
    role: "Chief Operational Officer (COO)",
    major: "Computer Science, BINUS University",
    bio: "Mengorkestrasi operasional harian, standarisasi alur bimbingan tutor, serta koordinasi kelancaran program belajar mahasiswa.",
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
    <div className="bg-white min-h-screen pb-20">
      <section className="border-b border-[#D9DEE7] bg-white py-16">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-3 py-1 text-xs font-medium text-[#20232B]">
            <Landmark className="h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> Didirikan Tahun 2026 di Universitas Bina Nusantara
          </div>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#20232B] tracking-tight leading-tight">
            “Dibuat oleh Mahasiswa, untuk Mahasiswa.”
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#626B78]">
            NEXIERA berangkat dari pengalaman yang akrab bagi banyak mahasiswa <b>BINUS University</b>.
            Mencari tutor yang tepat, memahami materi yang terasa rumit, dan merapikan begitu banyak
            sumber belajar sering kali sama melelahkannya dengan menghadapi kuliah itu sendiri. Kami
            membangun satu ruang belajar yang lebih terarah, agar mahasiswa bisa menemukan dukungan
            akademik dengan lebih mudah dan menggunakan waktunya untuk benar-benar memahami materi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 items-stretch rounded-[6px] border border-[#D9DEE7] bg-white p-8 md:p-10">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#2457C5] uppercase">
              Latar Belakang &amp; Visi
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-[#20232B] leading-snug">
              Menyatukan Papan Pengumuman Akademik ke Satu Platform Digital Terpadu
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#626B78]">
              Di tengah padatnya jadwal kuliah, menemukan bantuan belajar yang relevan sering terasa seperti pekerjaan tambahan. Informasi kelas tersebar, catatan tersimpan di banyak tempat, sementara penjelasan yang dibutuhkan bisa jadi sulit ditemukan tepat saat diperlukan. NEXIERA ingin membuat proses itu lebih sederhana dan terarah.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#626B78]">
              Karena itu, NEXIERA mempertemukan mahasiswa yang ingin belajar lebih terstruktur dengan tutor sebaya dan penyedia kelas dalam satu platform. Mahasiswa dapat menjelajahi kelas yang sesuai kebutuhan, sementara tutor memiliki ruang untuk membagikan cara belajar, pengalaman, dan pemahaman materi yang mereka kuasai.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/cari-kelas"
                className="btn-primary"
              >
                Cari kelas <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/buat-kelas"
                className="btn-secondary"
              >
                Buat kelas
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[6px] border border-[#D9DEE7] bg-[#E5E9F0]/40 p-6 sm:p-8">
            <div>
              <h3 className="text-lg font-semibold text-[#20232B]">Komitmen Integritas Akademik</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#626B78]">
                Bagi kami, keberhasilan belajar berarti memahami konsep dan mampu menggunakannya secara mandiri. NEXIERA mendukung diskusi, latihan, rangkuman, dan panduan praktikum sebagai bekal belajar; setiap dukungan akademik harus tetap menghormati proses dan integritas mahasiswa.
              </p>
            </div>
            <div className="mt-6 space-y-3 border-t border-[#D9DEE7] pt-4 text-xs font-medium text-[#20232B]">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> Verifikasi Status Mahasiswa Resmi
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> Review Kurikulum Selaras Silabus Perkuliahan
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> Transparansi Materi Belajar &amp; Tautan Akses
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-10 border-t border-[#D9DEE7]">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-wider text-[#2457C5] uppercase">
            Pilar Pembelajaran
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-[#20232B]">
            Mengapa NEXIERA Berbeda?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="nx-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#20232B]">
                <v.icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#20232B]">{v.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#626B78]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-12 border-t border-[#D9DEE7]">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-wider text-[#2457C5] uppercase">
            Tim Pendiri NEXIERA
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-[#20232B]">
            5 Founders Mahasiswa BINUS University
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#626B78]">
            Berawal dari pengalaman sebagai mahasiswa School of Computer Science BINUS University, tim pendiri NEXIERA merancang platform ini untuk membuat dukungan belajar yang relevan lebih mudah dijangkau.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDERS.map((f) => (
            <div
              key={f.name}
              className="nx-card p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-semibold text-[#20232B]">
                  {f.name}
                </h3>
                <p className="text-xs font-medium text-[#2457C5] mt-0.5">
                  {f.role}
                </p>
                <p className="text-xs text-[#626B78] mt-0.5">
                  {f.major}
                </p>
              </div>

              <div className="mt-4 border-t border-[#D9DEE7] pt-3">
                <p className="text-xs leading-relaxed text-[#626B78]">
                  {f.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#20232B]">
            Siap Mengamankan Nilai Akademik Semester Ini?
          </h2>
          <p className="mx-auto mt-2.5 max-w-lg text-sm text-[#626B78] leading-relaxed">
            Temukan kelas yang sesuai dengan kebutuhanmu, belajar bersama tutor sebaya, dan susun persiapan ujian dengan lebih terarah.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/cari-kelas"
              className="btn-primary"
            >
              Cari kelas <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/register"
              className="btn-secondary"
            >
              Daftar Akun
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
