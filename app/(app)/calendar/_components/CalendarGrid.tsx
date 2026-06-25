"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { FC } from "react";

import { MONTHS, WEEK_DAYS } from "@/app/(app)/calendar/_lib/constants";
import { formatDatePT, isoDate } from "@/app/(app)/calendar/_lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { StatusEnum, Task } from "@/types/task";

interface CalendarGridProps {
  year: number;
  month: number;
  calDays: (number | null)[];
  todayStr: string | null;
  selected: string | null;
  tasksByDate: Record<string, Task[]>;
  subjectMap: Record<string, Subject>;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
}

const CalendarGrid: FC<CalendarGridProps> = ({
  year,
  month,
  calDays,
  todayStr,
  selected,
  tasksByDate,
  subjectMap,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
}) => {
  const selectedTasks = selected ? (tasksByDate[selected] ?? []) : [];

  return (
    <Card className="flex-1 min-w-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {MONTHS[month]} {year}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="size-7" onClick={onPrevMonth}>
              <IconChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onGoToToday}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" className="size-7" onClick={onNextMonth}>
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Week day headers */}
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
            if (day === null) return <div key={`empty-${idx}`} />;

            const dateStr = isoDate(year, month, day);
            const dayTasks = tasksByDate[dateStr] ?? [];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selected;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => onSelectDate(dateStr)}
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
                {dayTasks.length > 0 && (
                  <div className="flex gap-0.5 flex-wrap justify-center max-w-full">
                    {dayTasks.slice(0, 3).map((t) => {
                      const subject = subjectMap[t.subjectId];
                      return (
                        <div
                          key={t.id}
                          className="size-1.5 rounded-full"
                          style={{
                            backgroundColor: isSelected
                              ? "white"
                              : (subject?.color ?? "currentColor"),
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
            {selectedTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sem tarefas neste dia.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedTasks.map((t) => {
                  const subject = subjectMap[t.subjectId];
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 rounded-md border border-border px-2.5 py-2 text-sm"
                    >
                      {subject && (
                        <div
                          className="size-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: subject.color }}
                        />
                      )}
                      <span className="flex-1 truncate font-medium text-foreground">{t.title}</span>
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
  );
};

export default CalendarGrid;
