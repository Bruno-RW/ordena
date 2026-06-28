"use client";

import { IconClock, IconDoor, IconEdit, IconTrash, IconUser } from "@tabler/icons-react";

import { FC } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Score } from "@/types/score";
import { Subject } from "@/types/subject";
import { Task } from "@/types/task";

interface SubjectCardProps {
  subject: Subject;
  tasks: Task[];
  scores: Score[];
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

function subjectAverage(scores: Score[]): number | null {
  if (scores.length === 0) return null;
  const totalWeight = scores.reduce((acc, n) => acc + n.weight, 0);
  const sum = scores.reduce((acc, n) => acc + n.value * n.weight, 0);
  return totalWeight > 0 ? sum / totalWeight : null;
}

const SubjectCard: FC<SubjectCardProps> = ({ subject, tasks, scores, onEdit, onDelete }) => {
  const subjectTasks = tasks.filter((t) => t.subjectId === subject.id);
  const subjectScores = scores.filter((n) => n.subjectId === subject.id);
  const average = subjectAverage(subjectScores);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="size-3 shrink-0 rounded-full mt-0.5"
              style={{ backgroundColor: subject.color }}
            />
            <CardTitle className="text-base leading-snug">{subject.name}</CardTitle>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="size-7" onClick={() => onEdit(subject)}>
              <IconEdit className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(subject.id)}
            >
              <IconTrash className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <IconUser className="size-3.5 shrink-0" />
            {subject.professor}
          </span>
          <span className="flex items-center gap-2">
            <IconClock className="size-3.5 shrink-0" />
            {subject.time}
          </span>
          <span className="flex items-center gap-2">
            <IconDoor className="size-3.5 shrink-0" />
            {subject.room}
          </span>
        </div>
        <div className="flex gap-2 pt-1 flex-wrap">
          <Badge variant="secondary">
            {subjectTasks.length} tarefa{subjectTasks.length === 1 ? "" : "s"}
          </Badge>
          {average !== null && (
            <Badge variant={average >= 7 ? "default" : "destructive"}>
              Média: {average.toFixed(1)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
