"use client";

import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";

import { STATUS_LABELS, STATUS_VARIANTS } from "@/app/(app)/tasks/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { StatusEnum, Task } from "@/types/task";

import { formatDateLabel } from "./utils";

interface TaskItemProps {
  task: Task;
  subject: Subject | undefined;
  today: Date | null;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, subject, today, onToggle, onEdit, onDelete }: TaskItemProps) {
  const days = today ? (() => {
    const t = new Date(today);
    t.setHours(0, 0, 0, 0);
    const d = new Date(task.deadline);
    d.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - t.getTime()) / 86400000);
  })() : null;

  const isOverdue = days !== null && days < 0 && task.status !== StatusEnum.COMPLETED;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5",
        task.status === StatusEnum.COMPLETED && "opacity-60"
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        className={cn(
          "size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
          task.status === StatusEnum.COMPLETED
            ? "bg-primary border-primary"
            : "border-muted-foreground hover:border-primary"
        )}
        aria-label="Alternar status"
      >
        {task.status === StatusEnum.COMPLETED && (
          <IconCheck className="size-3 text-primary-foreground" />
        )}
      </button>

      <div className="flex flex-1 items-center gap-3 min-w-0 flex-wrap">
        <span
          className={cn(
            "text-sm font-medium text-foreground truncate",
            task.status === StatusEnum.COMPLETED && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </span>
        {subject && (
          <span
            className="text-xs px-1.5 py-0.5 rounded-sm font-medium text-white shrink-0"
            style={{ backgroundColor: subject.color }}
          >
            {subject.name}
          </span>
        )}
        <Badge variant={STATUS_VARIANTS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
      </div>

      <span
        className={cn(
          "text-xs shrink-0 font-medium",
          isOverdue ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {formatDateLabel(task.deadline, today)}
      </span>

      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="size-7" onClick={() => onEdit(task)}>
          <IconEdit className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive"
          onClick={() => onDelete(task.id)}
        >
          <IconTrash className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
