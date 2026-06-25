"use client";

import { IconBookmark, IconCheck, IconListCheck, IconSchool } from "@tabler/icons-react";

import { FC } from "react";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

interface DashboardStatsProps {
  subjectCount: number;
  openTaskCount: number;
  completedTaskCount: number;
  totalTaskCount: number;
  globalAverage: number;
}

const DashboardStats: FC<DashboardStatsProps> = ({
  subjectCount,
  openTaskCount,
  completedTaskCount,
  totalTaskCount,
  globalAverage,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconSchool className="size-3.5" />
            Disciplinas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold text-foreground">{subjectCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">semestre atual</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconListCheck className="size-3.5" />
            Tarefas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold text-foreground">{openTaskCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">em aberto</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconCheck className="size-3.5" />
            Concluídas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold text-foreground">{completedTaskCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">de {totalTaskCount} tarefas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <IconBookmark className="size-3.5" />
            Média geral
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold text-foreground">{globalAverage.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">de 10.0</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
