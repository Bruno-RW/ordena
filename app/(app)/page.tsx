"use client";

import {
  IconAlertCircle,
  IconBookmark,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconListCheck,
  IconSchool,
} from "@tabler/icons-react";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/hooks/useData";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { StatusEnum } from "@/types/task";

function statusLabel(status: StatusEnum) {
  if (status === StatusEnum.COMPLETED) return "Concluída";
  if (status === StatusEnum.IN_PROGRESS) return "Em andamento";
  return "Pendente";
}

function statusVariant(status: StatusEnum): "default" | "secondary" | "outline" | "destructive" {
  if (status === StatusEnum.COMPLETED) return "default";
  if (status === StatusEnum.IN_PROGRESS) return "secondary";
  return "outline";
}

function daysUntil(dateStr: string, today: Date) {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);

  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);

  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function DashboardPage() {
  const { subjects, tasks, scores, profile } = useData();
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => setToday(new Date()), []);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === StatusEnum.COMPLETED).length;
    const pendingTasks = tasks.filter((t) => t.status === StatusEnum.PENDING).length;
    const inProgressTasks = tasks.filter((t) => t.status === StatusEnum.IN_PROGRESS).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    };
  }, [tasks]);

  const nextTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== StatusEnum.COMPLETED)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [tasks]);

  const globalAverage = useMemo(() => {
    if (scores.length === 0) return 0;

    const totalWeight = scores.reduce((acc, n) => acc + n.weight, 0);
    const sum = scores.reduce((acc, n) => acc + n.value * n.weight, 0);

    return totalWeight > 0 ? sum / totalWeight : 0;
  }, [scores]);

  const subjectMap = useMemo(() => Object.fromEntries(subjects.map((d) => [d.id, d])), [subjects]);

  const progressPercentage =
    stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={`Olá, ${profile.name.split(" ")[0]}`}
        description="Veja um resumo da sua semana acadêmica"
      />

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconSchool className="size-3.5" />
                Disciplinas
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-foreground">{subjects.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">semestre atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconListCheck className="size-3.5" />
                Tarefas
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {stats.pendingTasks + stats.inProgressTasks}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">em aberto</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconCheck className="size-3.5" />
                Concluídas
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.completedTasks}</p>
              <p className="text-xs text-muted-foreground mt-0.5">de {stats.totalTasks} tarefas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconBookmark className="size-3.5" />
                Média geral
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-foreground">{globalAverage.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">de 10,0</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* General progress */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Progresso do semestre</CardTitle>
              <CardDescription>
                {stats.completedTasks} de {stats.totalTasks} tarefas concluídas
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-semibold text-foreground">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                {[
                  {
                    label: "Concluídas",
                    count: stats.completedTasks,
                    color: "bg-primary",
                  },
                  {
                    label: "Em andamento",
                    count: stats.inProgressTasks,
                    color: "bg-chart-2",
                  },
                  {
                    label: "Pendentes",
                    count: stats.pendingTasks,
                    color: "bg-muted-foreground",
                  },
                ].map((item) => (
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

          {/* Próximas tasks */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Próximas entregas</CardTitle>
                <CardDescription>Tarefas mais urgentes</CardDescription>
              </div>

              <Link
                href="/tasks"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Ver todas
                <IconChevronRight className="size-3" />
              </Link>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              {nextTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm gap-2">
                  <IconCheck className="size-8 opacity-40" />
                  <span>Nenhuma tarefa pendente</span>
                </div>
              ) : (
                nextTasks.map((tarefa) => {
                  const subject = subjectMap[tarefa.subjectId] as Subject | undefined;
                  const days = today ? daysUntil(tarefa.deadline, today) : null;
                  const isUrgent = days !== null && days <= 2;

                  return (
                    <div
                      key={tarefa.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {tarefa.title}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {subject && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-sm font-medium text-white"
                              style={{ backgroundColor: subject.color }}
                            >
                              {subject.name}
                            </span>
                          )}
                          <Badge variant={statusVariant(tarefa.status)}>
                            {statusLabel(tarefa.status)}
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
                        <span>
                          {days === null
                            ? formatDate(tarefa.deadline)
                            : days === 0
                              ? "Hoje"
                              : days === 1
                                ? "Amanhã"
                                : days < 0
                                  ? "Atrasada"
                                  : formatDate(tarefa.deadline)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subjects row */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Disciplinas do semestre</CardTitle>
              <CardDescription>{subjects.length} disciplinas matriculadas</CardDescription>
            </div>

            <Link
              href="/subjects"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Gerenciar
              <IconChevronRight className="size-3" />
            </Link>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((s) => {
                const myTasks = tasks.filter((t) => t.subjectId === s.id);
                const myCompletedTasks = myTasks.filter(
                  (t) => t.status === StatusEnum.COMPLETED
                ).length;
                const percentage =
                  myTasks.length > 0 ? Math.round((myCompletedTasks / myTasks.length) * 100) : 0;

                return (
                  <div
                    key={s.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                    </div>

                    <p className="text-xs text-muted-foreground">{s.professor}</p>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {myCompletedTasks}/{myTasks.length} tasks
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
      </main>
    </div>
  );
}
