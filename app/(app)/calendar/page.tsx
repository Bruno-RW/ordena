"use client";

import { IconCalendar, IconChevronLeft, IconChevronRight, IconClock } from "@tabler/icons-react";

import { useEffect, useMemo, useState } from "react";

import { MONTHS, WEEK_DAYS } from "@/app/(app)/calendar/constants";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { cn } from "@/lib/utils";
import { StatusEnum } from "@/types/task";

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

  // Build calendar grid
  const calDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  }, [year, month]);

  const discMap = useMemo(() => Object.fromEntries(subjects.map((d) => [d.id, d])), [subjects]);

  // Map date -> tarefas
  const tarefasByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    for (const t of tasks) {
      if (!map[t.deadline]) map[t.deadline] = [];
      map[t.deadline].push(t);
    }
    return map;
  }, [tasks]);

  const selectedTarefas = selected ? (tarefasByDate[selected] ?? []) : [];

  // Upcoming events for sidebar
  const upcoming = useMemo(() => {
    if (!todayStr) return [];
    return tasks
      .filter((t) => t.deadline >= todayStr && t.status !== StatusEnum.COMPLETED)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 8);
  }, [tasks, todayStr]);

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  function formatDatePT(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Calendário" description="Prazos e eventos" />

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Calendar */}
        <Card className="flex-1 min-w-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {MONTHS[month]} {year}
              </CardTitle>

              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="size-7" onClick={prevMonth}>
                  <IconChevronLeft className="size-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    const now = new Date();
                    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
                    setSelected(isoDate(now.getFullYear(), now.getMonth(), now.getDate()));
                  }}
                >
                  Hoje
                </Button>

                <Button variant="outline" size="icon" className="size-7" onClick={nextMonth}>
                  <IconChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Header row */}
            <div className="grid grid-cols-7 mb-1">
              {WEEK_DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {calDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} />;
                }
                const dateStr = isoDate(year, month, day);
                const dayTarefas = tarefasByDate[dateStr] ?? [];
                const hasPending = dayTarefas.some((t) => t.status !== StatusEnum.COMPLETED);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selected;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelected(dateStr)}
                    className={cn(
                      "relative flex flex-col items-center justify-start gap-0.5 rounded-lg py-1.5 px-1 text-sm transition-colors min-h-12",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isToday
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted text-foreground"
                    )}
                  >
                    <span className="text-sm leading-none">{day}</span>
                    {dayTarefas.length > 0 && (
                      <div className="flex gap-0.5 flex-wrap justify-center max-w-full">
                        {dayTarefas.slice(0, 3).map((t) => {
                          const disc = discMap[t.subjectId];
                          return (
                            <div
                              key={t.id}
                              className="size-1.5 rounded-full"
                              style={{
                                backgroundColor: isSelected
                                  ? "white"
                                  : (disc?.color ?? "currentColor"),
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected day detail */}
            {selected && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  {formatDatePT(selected)}
                </p>
                {selectedTarefas.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sem tarefas neste dia.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedTarefas.map((t) => {
                      const disc = discMap[t.subjectId];
                      return (
                        <div
                          key={t.id}
                          className="flex items-center gap-2 rounded-md border border-border px-2.5 py-2 text-sm"
                        >
                          {disc && (
                            <div
                              className="size-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: disc.color }}
                            />
                          )}
                          <span className="flex-1 truncate font-medium text-foreground">
                            {t.title}
                          </span>
                          <Badge
                            variant={
                              t.status === StatusEnum.COMPLETED
                                ? "default"
                                : t.status === StatusEnum.IN_PROGRESS
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {t.status === StatusEnum.COMPLETED
                              ? "Concluída"
                              : t.status === StatusEnum.IN_PROGRESS
                                ? "Em andamento"
                                : "Pendente"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming sidebar */}
        <Card className="w-full lg:w-72 shrink-0">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Próximos prazos</CardTitle>
            <CardDescription>Tarefas pendentes</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center py-6 gap-2 text-muted-foreground text-sm">
                <IconCalendar className="size-8 opacity-30" />
                <span>Nenhum prazo próximo</span>
              </div>
            ) : (
              upcoming.map((t) => {
                const disc = discMap[t.subjectId];
                const days = todayStr
                  ? Math.round(
                      (new Date(t.deadline + "T00:00:00").getTime() -
                        new Date(todayStr + "T00:00:00").getTime()) /
                        86400000
                    )
                  : null;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelected(t.deadline);
                      setViewDate(
                        new Date(
                          parseInt(t.deadline.split("-")[0]),
                          parseInt(t.deadline.split("-")[1]) - 1,
                          1
                        )
                      );
                    }}
                    className="flex items-start gap-2 text-left rounded-lg hover:bg-muted p-2 -mx-2 transition-colors"
                  >
                    {disc && (
                      <div
                        className="size-2.5 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: disc.color }}
                      />
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{disc?.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconClock className="size-3" />
                        {days === null
                          ? formatDatePT(t.deadline)
                          : days === 0
                            ? "Hoje"
                            : days === 1
                              ? "Amanhã"
                              : `em ${days} dias`}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
