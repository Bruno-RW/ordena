"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SemesterProgressProps {
  completedTasks: number;
  totalTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
}

export function SemesterProgress({
  completedTasks,
  totalTasks,
  inProgressTasks,
  pendingTasks,
}: SemesterProgressProps) {
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const items = [
    { label: "Concluídas", count: completedTasks, color: "bg-primary" },
    { label: "Em andamento", count: inProgressTasks, color: "bg-chart-2" },
    { label: "Pendentes", count: pendingTasks, color: "bg-muted-foreground" },
  ];

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Progresso do semestre</CardTitle>
        <CardDescription>
          {completedTasks} de {totalTasks} tarefas concluídas
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold text-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={cn("size-2.5 rounded-full", item.color)} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
              <span className="font-medium text-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
