"use client";

import { IconCalendar, IconClock } from "@tabler/icons-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Subject } from "@/types/subject";
import { Task } from "@/types/task";

interface UpcomingSidebarProps {
  upcoming: Task[];
  todayStr: string | null;
  subjectMap: Record<string, Subject>;
  onSelectTask: (deadline: string) => void;
}

function formatDatePT(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function UpcomingSidebar({
  upcoming,
  todayStr,
  subjectMap,
  onSelectTask,
}: UpcomingSidebarProps) {
  return (
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
          upcoming.map((task) => {
            const subject = subjectMap[task.subjectId];
            const days =
              todayStr
                ? Math.round(
                    (new Date(task.deadline + "T00:00:00").getTime() -
                      new Date(todayStr + "T00:00:00").getTime()) /
                      86400000
                  )
                : null;

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onSelectTask(task.deadline)}
                className="flex items-start gap-2 text-left rounded-lg hover:bg-muted p-2 -mx-2 transition-colors"
              >
                {subject && (
                  <div
                    className="size-2.5 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{subject?.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <IconClock className="size-3" />
                    {days === null
                      ? formatDatePT(task.deadline)
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
  );
}
