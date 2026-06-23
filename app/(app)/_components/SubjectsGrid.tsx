"use client";

import { IconEdit } from "@tabler/icons-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Subject } from "@/types/subject";
import { StatusEnum, Task } from "@/types/task";

interface SubjectsGridProps {
  subjects: Subject[];
  tasks: Task[];
}

export function SubjectsGrid({ subjects, tasks }: SubjectsGridProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Disciplinas do semestre</CardTitle>
          <CardDescription>{subjects.length} disciplinas matriculadas</CardDescription>
        </div>
        <Link href="/subjects">
          <Button>
            <IconEdit />
            Gerenciar
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const subjectTasks = tasks.filter((t) => t.subjectId === subject.id);
            const completed = subjectTasks.filter((t) => t.status === StatusEnum.COMPLETED).length;
            const percentage =
              subjectTasks.length > 0 ? Math.round((completed / subjectTasks.length) * 100) : 0;

            return (
              <div
                key={subject.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  <p className="text-sm font-medium text-foreground truncate">{subject.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{subject.professor}</p>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {completed}/{subjectTasks.length} tasks
                    </span>
                    <span className="font-medium text-foreground">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-1.5" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
