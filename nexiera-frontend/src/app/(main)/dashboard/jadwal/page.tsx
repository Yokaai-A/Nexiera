import { InteractiveCalendar } from "@/src/components/dashboard/InteractiveCalendar";

export default function JadwalBimbinganPage() {
  return (
    <div className="space-y-4">
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
          Kalender Akademik
        </p>
        <h1 className="mt-1 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
          Jadwal Bimbingan & Sesi Kelas
        </h1>
        <p className="mt-0.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
          Pilih tanggal bertanda titik biru untuk mengakses tautan Zoom/Meet, materi kurikulum, dan kontak tutor.
        </p>
      </header>

      <InteractiveCalendar />
    </div>
  );
}
