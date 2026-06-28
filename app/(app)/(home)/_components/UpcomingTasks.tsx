"use client";

import { IconAlertCircle, IconCheck, IconClock, IconEye } from "@tabler/icons-react";

import { FC } from "react";

import Link from "next/link";

import { STATUS_LABELS, STATUS_VARIANTS } from "@/app/(app)/tasks/_lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, daysUntil, formatDateLabel } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { Task } from "@/types/task";

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
            const days = today ? daysUntil(task.deadline, today) : null;
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

                    <Badge variant={STATUS_VARIANTS[task.status]}>
                      {STATUS_LABELS[task.status]}
                    </Badge>
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

                  <span>{formatDateLabel(task.deadline, today)}</span>
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
