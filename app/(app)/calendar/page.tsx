"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "@/components/Header";
import { useData } from "@/hooks/useData";
import { StatusEnum } from "@/types/task";

import { CalendarGrid } from "./_components/CalendarGrid";
import { UpcomingSidebar } from "./_components/UpcomingSidebar";

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const { tasks, subjects } = useData();

  const defaultDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [todayStr, setTodayStr] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState<Date>(defaultDate);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const str = isoDate(now.getFullYear(), now.getMonth(), now.getDate());
    setTodayStr(str);
    setSelected(str);
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const calDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [year, month]);

  const subjectMap = useMemo(() => Object.fromEntries(subjects.map((d) => [d.id, d])), [subjects]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    for (const t of tasks) {
      if (!map[t.deadline]) map[t.deadline] = [];
      map[t.deadline].push(t);
    }
    return map;
  }, [tasks]);

  const upcoming = useMemo(() => {
    if (!todayStr) return [];
    return tasks
      .filter((t) => t.deadline >= todayStr && t.status !== StatusEnum.COMPLETED)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 8);
  }, [tasks, todayStr]);

  function handleSelectTask(deadline: string) {
    setSelected(deadline);
    const [y, m] = deadline.split("-").map(Number);
    setViewDate(new Date(y, m - 1, 1));
  }

  function handleGoToToday() {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(isoDate(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Calendário" description="Prazos e eventos" />

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-4 lg:flex-row lg:items-start">
        <CalendarGrid
          year={year}
          month={month}
          calDays={calDays}
          todayStr={todayStr}
          selected={selected}
          tasksByDate={tasksByDate}
          subjectMap={subjectMap}
          onSelectDate={setSelected}
          onPrevMonth={() => setViewDate(new Date(year, month - 1, 1))}
          onNextMonth={() => setViewDate(new Date(year, month + 1, 1))}
          onGoToToday={handleGoToToday}
        />

        <UpcomingSidebar
          upcoming={upcoming}
          todayStr={todayStr}
          subjectMap={subjectMap}
          onSelectTask={handleSelectTask}
        />
      </main>
    </div>
  );
}
