"use client";

import {
  IconCheck,
  IconEdit,
  IconFilter,
  IconListCheck,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { STATUS_LABELS, STATUS_VARIANTS } from "@/app/(app)/tasks/constants";
import Header from "@/components/Header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/hooks/useData";
import { cn } from "@/lib/utils";
import { StatusEnum, Task } from "@/types/task";

function daysUntil(dateStr: string, today: Date) {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

function formatDateLabel(dateStr: string, today: Date | null) {
  if (!today) {
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }
  const days = daysUntil(dateStr, today);
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  if (days < 0) return `Atrasada ${Math.abs(days)}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

type FormData = Omit<Task, "id">;

const emptyForm: FormData = {
  title: "",
  subjectId: "",
  deadline: "",
  status: StatusEnum.PENDING,
  description: "",
};

export default function TarefasPage() {
  const { tasks, subjects, addTask, updateTask, deleteTask, toggleTask } = useData();

  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  const [filterDisc, setFilterDisc] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const subjectMap = useMemo(() => Object.fromEntries(subjects.map((d) => [d.id, d])), [subjects]);

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => filterDisc === "all" || t.subjectId === filterDisc)
      .filter((t) => filterStatus === "all" || t.status === filterStatus)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [tasks, filterDisc, filterStatus]);

  function openAdd() {
    setEditing(null);
    setForm({
      ...emptyForm,
      subjectId: subjects[0]?.id ?? "",
    });
    setDialogOpen(true);
  }

  function openEdit(t: Task) {
    setEditing(t);
    setForm({
      title: t.title,
      subjectId: t.subjectId,
      deadline: t.deadline,
      status: t.status,
      description: t.description ?? "",
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error("O título da tarefa é obrigatório.");
      return;
    }

    if (!form.deadline) {
      toast.error("O prazo é obrigatório.");
      return;
    }

    if (editing) {
      updateTask({ ...editing, ...form });
      toast.success("Tarefa atualizada.");
    } else {
      addTask(form);
      toast.success("Tarefa adicionada.");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteTask(deleteId);
    toast.success("Tarefa removida.");
    setDeleteId(null);
  }

  const groups = useMemo(() => {
    const pending = filtered.filter((t) => t.status === StatusEnum.PENDING);
    const ongoing = filtered.filter((t) => t.status === StatusEnum.IN_PROGRESS);
    const done = filtered.filter((t) => t.status === StatusEnum.COMPLETED);

    return [
      { key: "pending", label: "Pendentes", items: pending },
      { key: "in_progress", label: "Em andamento", items: ongoing },
      { key: "completed", label: "Concluídas", items: done },
    ].filter((g) => g.items.length > 0 || filterStatus === "all");
  }, [filtered, filterStatus]);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Tarefas" description="Lista e filtros">
        <Button size="sm" onClick={openAdd}>
          <IconPlus data-icon="inline-start" />
          Nova tarefa
        </Button>
      </Header>

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-4">
        {/* Filters */}
        <Card>
          <CardContent className="flex flex-wrap gap-3 py-3">
            <div className="flex items-center gap-2">
              <IconFilter className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filtros</span>
            </div>

            <Select value={filterDisc} onValueChange={(v) => setFilterDisc(v ?? "all")}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue>
                  {filterDisc === "all"
                    ? "Todas as disciplinas"
                    : (subjects.find((d) => d.id === filterDisc)?.name ?? "Disciplina")}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todas as disciplinas</SelectItem>
                {subjects.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue>
                  {filterStatus === "all"
                    ? "Todos os status"
                    : filterStatus === StatusEnum.PENDING
                      ? "Pendente"
                      : filterStatus === StatusEnum.IN_PROGRESS
                        ? "Em andamento"
                        : "Concluída"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
            {(filterDisc !== "all" || filterStatus !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterDisc("all");
                  setFilterStatus("all");
                }}
                className="h-8 text-xs"
              >
                Limpar filtros
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Counts */}
        <div className="text-sm text-muted-foreground">
          {filtered.length} tarefa{filtered.length !== 1 ? "s" : ""} encontrada
          {filtered.length !== 1 ? "s" : ""}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <IconListCheck className="size-12 opacity-30" />
            <p className="text-sm">Nenhuma tarefa encontrada.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map((group) =>
              group.items.length === 0 ? null : (
                <div key={group.key} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">{group.label}</h2>
                    <Badge variant="secondary">{group.items.length}</Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.items.map((t) => {
                      const disc = subjectMap[t.subjectId];
                      const days = today ? daysUntil(t.deadline, today) : null;
                      const isOverdue =
                        days !== null && days < 0 && t.status !== StatusEnum.COMPLETED;

                      return (
                        <div
                          key={t.id}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5",
                            t.status === StatusEnum.COMPLETED && "opacity-60"
                          )}
                        >
                          {/* Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleTask(t.id)}
                            className={cn(
                              "size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                              t.status === StatusEnum.COMPLETED
                                ? "bg-primary border-primary"
                                : "border-muted-foreground hover:border-primary"
                            )}
                            aria-label="Alternar status"
                          >
                            {t.status === StatusEnum.COMPLETED && (
                              <IconCheck className="size-3 text-primary-foreground" />
                            )}
                          </button>

                          {/* Content */}
                          <div className="flex flex-1 items-center gap-3 min-w-0 flex-wrap">
                            <span
                              className={cn(
                                "text-sm font-medium text-foreground truncate",
                                t.status === StatusEnum.COMPLETED &&
                                  "line-through text-muted-foreground"
                              )}
                            >
                              {t.title}
                            </span>
                            {disc && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded-sm font-medium text-white shrink-0"
                                style={{ backgroundColor: disc.color }}
                              >
                                {disc.name}
                              </span>
                            )}
                            <Badge variant={STATUS_VARIANTS[t.status]}>
                              {STATUS_LABELS[t.status]}
                            </Badge>
                          </div>

                          {/* Date */}
                          <span
                            className={cn(
                              "text-xs shrink-0 font-medium",
                              isOverdue ? "text-destructive" : "text-muted-foreground"
                            )}
                          >
                            {formatDateLabel(t.deadline, today)}
                          </span>

                          {/* Actions */}
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => openEdit(t)}
                            >
                              <IconEdit className="size-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(t.id)}
                            >
                              <IconTrash className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
            <DialogDescription>Preencha os dados da tarefa.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Lista 3 – Derivadas"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Disciplina</Label>
                <Select
                  value={form.subjectId}
                  onValueChange={(v) => setForm({ ...form, subjectId: v ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>

                  <SelectContent>
                    {subjects.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deadline">Prazo *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: (v ?? StatusEnum.PENDING) as StatusEnum })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={StatusEnum.PENDING}>Pendente</SelectItem>
                  <SelectItem value={StatusEnum.IN_PROGRESS}>Em andamento</SelectItem>
                  <SelectItem value={StatusEnum.COMPLETED}>Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detalhes opcionais..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>

            <Button onClick={handleSave}>{editing ? "Salvar alterações" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover tarefa?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
