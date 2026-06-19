"use client";

import {
  IconAlertCircle,
  IconBookmark,
  IconCalendarEvent,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconListCheck,
  IconSchool,
} from "@tabler/icons-react";
import Link from "next/link";
import { useMemo } from "react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/store";
import type { Disciplina } from "@/data/mock";
import { cn } from "@/lib/utils";

function statusLabel(status: string) {
  if (status === "concluida") return "Concluída";
  if (status === "em_andamento") return "Em andamento";
  return "Pendente";
}

function statusVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "concluida") return "default";
  if (status === "em_andamento") return "secondary";
  return "outline";
}

function daysUntil(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function DashboardPage() {
  const { disciplinas, tarefas, notas, perfil } = useStore();

  const stats = useMemo(() => {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.status === "concluida").length;
    const pendentes = tarefas.filter((t) => t.status === "pendente").length;
    const emAndamento = tarefas.filter(
      (t) => t.status === "em_andamento",
    ).length;
    return { total, concluidas, pendentes, emAndamento };
  }, [tarefas]);

  const proximasTarefas = useMemo(() => {
    return tarefas
      .filter((t) => t.status !== "concluida")
      .sort((a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime())
      .slice(0, 5);
  }, [tarefas]);

  const mediaGeral = useMemo(() => {
    if (notas.length === 0) return 0;
    const totalPeso = notas.reduce((acc, n) => acc + n.peso, 0);
    const soma = notas.reduce((acc, n) => acc + n.valor * n.peso, 0);
    return totalPeso > 0 ? soma / totalPeso : 0;
  }, [notas]);

  const disciplinaMap = useMemo(
    () => Object.fromEntries(disciplinas.map((d) => [d.id, d])),
    [disciplinas],
  );

  const progressoPct =
    stats.total > 0 ? Math.round((stats.concluidas / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title={`Olá, ${perfil.nome.split(" ")[0]}`}
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
              <p className="text-3xl font-bold text-foreground">
                {disciplinas.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                semestre atual
              </p>
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
                {stats.pendentes + stats.emAndamento}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                em aberto
              </p>
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
              <p className="text-3xl font-bold text-foreground">
                {stats.concluidas}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                de {stats.total} tarefas
              </p>
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
              <p className="text-3xl font-bold text-foreground">
                {mediaGeral.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                de 10,0
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Progresso geral */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Progresso do semestre
              </CardTitle>
              <CardDescription>
                {stats.concluidas} de {stats.total} tarefas concluídas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-semibold text-foreground">
                    {progressoPct}%
                  </span>
                </div>
                <Progress value={progressoPct} className="h-2" />
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                {[
                  {
                    label: "Concluídas",
                    count: stats.concluidas,
                    color: "bg-primary",
                  },
                  {
                    label: "Em andamento",
                    count: stats.emAndamento,
                    color: "bg-chart-2",
                  },
                  {
                    label: "Pendentes",
                    count: stats.pendentes,
                    color: "bg-muted-foreground",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn("size-2.5 rounded-full", item.color)}
                      />
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximas tarefas */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Próximas entregas
                </CardTitle>
                <CardDescription>Tarefas mais urgentes</CardDescription>
              </div>
              <Link
                href="/tarefas"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Ver todas
                <IconChevronRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {proximasTarefas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm gap-2">
                  <IconCheck className="size-8 opacity-40" />
                  <span>Nenhuma tarefa pendente</span>
                </div>
              ) : (
                proximasTarefas.map((tarefa) => {
                  const disc = disciplinaMap[tarefa.disciplinaId] as
                    | Disciplina
                    | undefined;
                  const days = daysUntil(tarefa.prazo);
                  const isUrgent = days <= 2;

                  return (
                    <div
                      key={tarefa.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {tarefa.titulo}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {disc && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-sm font-medium text-white"
                              style={{ backgroundColor: disc.cor }}
                            >
                              {disc.nome}
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
                          isUrgent
                            ? "text-destructive"
                            : "text-muted-foreground",
                        )}
                      >
                        {isUrgent ? (
                          <IconAlertCircle className="size-3.5" />
                        ) : (
                          <IconClock className="size-3.5" />
                        )}
                        <span>
                          {days === 0
                            ? "Hoje"
                            : days === 1
                              ? "Amanhã"
                              : days < 0
                                ? "Atrasada"
                                : formatDate(tarefa.prazo)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disciplinas row */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Disciplinas do semestre
              </CardTitle>
              <CardDescription>
                {disciplinas.length} disciplinas matriculadas
              </CardDescription>
            </div>
            <Link
              href="/disciplinas"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Gerenciar
              <IconChevronRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {disciplinas.map((d) => {
                const minhasTarefas = tarefas.filter(
                  (t) => t.disciplinaId === d.id,
                );
                const minhasConcluidas = minhasTarefas.filter(
                  (t) => t.status === "concluida",
                ).length;
                const pct =
                  minhasTarefas.length > 0
                    ? Math.round(
                        (minhasConcluidas / minhasTarefas.length) * 100,
                      )
                    : 0;

                return (
                  <div
                    key={d.id}
                    className="flex flex-col gap-2 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full shrink-0"
                        style={{ backgroundColor: d.cor }}
                      />
                      <p className="text-sm font-medium text-foreground truncate">
                        {d.nome}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {d.professor}
                    </p>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {minhasConcluidas}/{minhasTarefas.length} tarefas
                        </span>
                        <span className="font-medium text-foreground">
                          {pct}%
                        </span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
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
