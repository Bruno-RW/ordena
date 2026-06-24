"use client";

import { IconAlertCircle, IconCheck, IconClock, IconEye } from "@tabler/icons-react";

import { FC } from "react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { StatusEnum, Task } from "@/types/task";

function statusLabel(status: StatusEnum): string {
  if (status === StatusEnum.COMPLETED) return "Concluída";
  if (status === StatusEnum.IN_PROGRESS) return "Em andamento";
  return "Pendente";
}

function statusVariant(status: StatusEnum): "default" | "secondary" | "outline" | "destructive" {
  if (status === StatusEnum.COMPLETED) return "default";
  if (status === StatusEnum.IN_PROGRESS) return "secondary";
  return "outline";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

interface UpcomingTasksProps {
  tasks: Task[];
  subjectMap: Record<string, Subject>;
  today: Date | null;
}

const UpcomingTasks: FC<UpcomingTasksProps> = ({ tasks, subjectMap, today }) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Próximas entregas</CardTitle>
          <CardDescription>Tarefas mais urgentes</CardDescription>
        </div>
        <Link href="/tasks">
          <Button>
            <IconEye />
            Ver todas
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm gap-2">
            <IconCheck className="size-8 opacity-40" />
            <span>Nenhuma tarefa pendente</span>
          </div>
        ) : (
          tasks.map((task) => {
            const subject = subjectMap[task.subjectId] as Subject | undefined;
            const days = today
              ? (() => {
                  const t = new Date(today);
                  t.setHours(0, 0, 0, 0);
                  const d = new Date(task.deadline);
                  d.setHours(0, 0, 0, 0);
                  return Math.round((d.getTime() - t.getTime()) / 86400000);
                })()
              : null;
            const isUrgent = days !== null && days <= 2;

            return (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {subject && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-sm font-medium text-white"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.name}
                      </span>
                    )}
                    <Badge variant={statusVariant(task.status)}>{statusLabel(task.status)}</Badge>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs shrink-0 font-medium",
                    isUrgent ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {isUrgent ? (
                    <IconAlertCircle className="size-3.5" />
                  ) : (
                    <IconClock className="size-3.5" />
                  )}
                  <span>
                    {days === null
                      ? formatDate(task.deadline)
                      : days === 0
                        ? "Hoje"
                        : days === 1
                          ? "Amanhã"
                          : days < 0
                            ? "Atrasada"
                            : formatDate(task.deadline)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTasks;
