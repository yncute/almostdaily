"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function CalendarView() {
  const router = useRouter();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete the last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-5" />
        </button>

        <h2 className="text-xl font-semibold text-foreground">
          {MONTHS[month]} {year}
        </h2>

        <button
          onClick={nextMonth}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAYS.map((d) => (
          <div key={d} className="py-2 text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const dateStr = toDateString(year, month, day);
          const today_ = isToday(day);

          return (
            <button
              key={i}
              onClick={() => router.push(`/journal/${dateStr}`)}
              className={`
                aspect-square w-full rounded-lg text-sm font-medium transition-colors
                hover:bg-accent hover:text-accent-foreground
                ${today_
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Today shortcut */}
      {!(month === today.getMonth() && year === today.getFullYear()) && (
        <div className="mt-6 text-center">
          <button
            onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to today
          </button>
        </div>
      )}
    </div>
  );
}
