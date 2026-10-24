"use client";

import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mail,
  MessageCircle,
  Video,
  BookOpen,
} from "lucide-react";
import { nexieraApi, type ApiClass } from "@/src/lib/api";

const DAYS_HEADER = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function applySchedule(items: ApiClass[]) {
      setClasses(items);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextSession = items
        .filter((item) => item.startsAt)
        .map((item) => new Date(item.startsAt as string))
        .filter((date) => Number.isFinite(date.getTime()) && date >= today)
        .sort((a, b) => a.getTime() - b.getTime())[0];
      if (nextSession) {
        setCurrentDate(new Date(nextSession.getFullYear(), nextSession.getMonth(), 1));
        setSelectedDate(new Date(nextSession.getFullYear(), nextSession.getMonth(), nextSession.getDate()));
      }
    }

    async function fetchClasses() {
      try {
        setLoading(true);
        const res = await nexieraApi.myClasses();
        // Combine enrolled and created classes
        const all = [...(res.enrolled || []), ...(res.created || [])];
        applySchedule(Array.from(new Map(all.map((item) => [item.id, item])).values()));
      } catch {
        // Fallback to dashboard api
        try {
          const dash = await nexieraApi.dashboard();
          applySchedule(dash.classes || []);
        } catch {
          setClasses([]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Calendar dates come only from class schedules saved by the tutor.
  const getClassesForDate = (date: Date) => {
    return classes.filter((cls) => {
      if (!cls.startsAt) return false;
      const classDate = new Date(cls.startsAt);
      if (!Number.isFinite(classDate.getTime())) return false;
      return isSameDay(classDate, date);
    });
  };

  const selectedSessions = getClassesForDate(selectedDate);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  return (
    <div className="space-y-5">
      {/* Calendar Card */}
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        {/* Calendar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7] dark:border-[#343945]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
            <h2 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              {monthNames[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Bulan sebelumnya"
              className="rounded-[4px] border border-[#D9DEE7] p-1.5 text-[#626B78] hover:bg-[#E5E9F0] hover:text-[#20232B] dark:border-[#343945] dark:text-[#B1B7C3] dark:hover:bg-[#20242D] dark:hover:text-[#F3F4F6] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                setSelectedDate(now);
              }}
              className="rounded-[4px] border border-[#D9DEE7] px-2.5 py-1 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Bulan berikutnya"
              className="rounded-[4px] border border-[#D9DEE7] p-1.5 text-[#626B78] hover:bg-[#E5E9F0] hover:text-[#20232B] dark:border-[#343945] dark:text-[#B1B7C3] dark:hover:bg-[#20242D] dark:hover:text-[#F3F4F6] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 pt-3 text-center text-xs font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">
          {DAYS_HEADER.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10 sm:h-12" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const dayNumber = index + 1;
            const dateObj = new Date(year, month, dayNumber);
            const isSelected = isSameDay(dateObj, selectedDate);
            const isToday = isSameDay(dateObj, new Date());
            const hasSession = getClassesForDate(dateObj).length > 0;

            return (
              <button
                key={`day-${dayNumber}`}
                type="button"
                onClick={() => setSelectedDate(dateObj)}
                className={`relative flex h-10 sm:h-12 flex-col items-center justify-center rounded-[4px] border text-xs font-medium transition-all ${
                  isSelected
                    ? "border-[#2457C5] bg-[#2457C5] text-white font-semibold shadow-sm"
                    : isToday
                      ? "border-[#2457C5] text-[#2457C5] dark:text-[#78A0FF] bg-[#2457C5]/10"
                      : "border-transparent text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                }`}
              >
                <span>{dayNumber}</span>
                {hasSession && (
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-[#2457C5] dark:bg-[#78A0FF]"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Session Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Sesi Kelas: {selectedDate.toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <span className="text-xs text-[#626B78] dark:text-[#B1B7C3]">
            {selectedSessions.length} sesi tersedia
          </span>
        </div>

        {loading ? (
          <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 text-center text-xs text-[#626B78] dark:border-[#343945] dark:bg-[#191C23]">
            Memuat jadwal bimbingan...
          </div>
        ) : selectedSessions.length === 0 ? (
          <div className="rounded-[6px] border border-dashed border-[#D9DEE7] bg-white p-8 text-center dark:border-[#343945] dark:bg-[#191C23]">
            <p className="text-xs font-medium text-[#20232B] dark:text-[#F3F4F6]">
              Tidak ada sesi bimbingan pada tanggal ini.
            </p>
            <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Pilih tanggal lain yang memiliki tanda titik biru pada kalender.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {selectedSessions.map((session) => {
              const meetingUrl = session.meetingLink || session.meetingUrl;
              const materialUrl = session.materialLink || session.materialUrl;
              const tutorPhone = session.creator?.phoneNumber || session.tutor?.phoneNumber;
              const tutorEmail = session.creator?.email || session.tutor?.email;
              const tutorName = session.creator?.name || session.tutor?.name || "Pengajar";
              const sessionStart = session.startsAt ? new Date(session.startsAt) : null;

              return (
                <div
                  key={session.id}
                  className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-[4px] bg-[#2457C5]/10 px-2 py-0.5 text-[10px] font-semibold text-[#2457C5] dark:text-[#78A0FF]">
                        {session.courseType === "BOOTCAMP" || session.type === "BOOTCAMP"
                          ? "Bootcamp"
                          : "Peer-Tutoring"}
                      </span>
                      <span className="text-xs text-[#626B78] dark:text-[#B1B7C3]">
                        {session.category || session.mainCategory || "Akademik"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#20232B] dark:text-[#F3F4F6] truncate">
                      {session.title}
                    </h4>
                    {sessionStart && Number.isFinite(sessionStart.getTime()) && (
                      <p className="text-xs text-[#626B78] dark:text-[#B1B7C3]">
                        {sessionStart.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}

                    <p className="text-xs text-[#626B78] dark:text-[#B1B7C3]">
                      Pengajar: <span className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">{tutorName}</span>
                    </p>

                    {/* Tutor Contacts */}
                    {(tutorPhone || tutorEmail) && <div className="flex flex-wrap items-center gap-2 pt-1">
                      {tutorPhone && (
                      <a
                        href={`https://wa.me/${tutorPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp Tutor ({tutorPhone})</span>
                      </a>
                      )}
                      {tutorPhone && tutorEmail && <span className="text-slate-300 dark:text-slate-600">&bull;</span>}
                      {tutorEmail && (
                      <a
                        href={`mailto:${tutorEmail}`}
                        className="inline-flex items-center gap-1 text-[11px] text-[#2457C5] dark:text-[#78A0FF] hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{tutorEmail}</span>
                      </a>
                      )}
                    </div>}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {meetingUrl && (
                      <a
                        href={meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2457C5] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Masuk Sesi (Zoom/GMeet)</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    {materialUrl && (
                      <a
                        href={materialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs font-semibold text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Akses Materi</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
