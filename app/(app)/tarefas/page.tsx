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

import { PageHeader } from "@/components/page-header";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/context/store";
import type { Tarefa } from "@/data/mock";
import { cn } from "@/lib/utils";

type TarefaStatus = Tarefa["status"];

const STATUS_LABELS: Record<TarefaStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

const STATUS_VARIANTS: Record<
  TarefaStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  concluida: "default",
  em_andamento: "secondary",
  pendente: "outline",
};

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

type FormData = Omit<Tarefa, "id">;

const emptyForm: FormData = {
  titulo: "",
  disciplinaId: "",
  prazo: "",
  status: "pendente",
  descricao: "",
};

export default function TarefasPage() {
  const { tarefas, disciplinas, addTarefa, updateTarefa, deleteTarefa, toggleTarefa } =
    useStore();

  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => { setToday(new Date()); }, []);

  const [filterDisc, setFilterDisc] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Tarefa | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const discMap = useMemo(
    () => Object.fromEntries(disciplinas.map((d) => [d.id, d])),
    [disciplinas],
  );

  const filtered = useMemo(() => {
    return tarefas
      .filter((t) => filterDisc === "all" || t.disciplinaId === filterDisc)
      .filter((t) => filterStatus === "all" || t.status === filterStatus)
      .sort((a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime());
  }, [tarefas, filterDisc, filterStatus]);

  function openAdd() {
    setEditing(null);
    setForm({
      ...emptyForm,
      disciplinaId: disciplinas[0]?.id ?? "",
    });
    setDialogOpen(true);
  }

  function openEdit(t: Tarefa) {
    setEditing(t);
    setForm({
      titulo: t.titulo,
      disciplinaId: t.disciplinaId,
      prazo: t.prazo,
      status: t.status,
      descricao: t.descricao ?? "",
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.titulo.trim()) {
      toast.error("O título da tarefa é obrigatório.");
      return;
    }
    if (!form.prazo) {
      toast.error("O prazo é obrigatório.");
      return;
    }
    if (editing) {
      updateTarefa({ ...editing, ...form });
      toast.success("Tarefa atualizada.");
    } else {
      addTarefa(form);
      toast.success("Tarefa adicionada.");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteTarefa(deleteId);
    toast.success("Tarefa removida.");
    setDeleteId(null);
  }

  const groups = useMemo(() => {
    const pending = filtered.filter((t) => t.status === "pendente");
    const ongoing = filtered.filter((t) => t.status === "em_andamento");
    const done = filtered.filter((t) => t.status === "concluida");
    return [
      { key: "pendente", label: "Pendentes", items: pending },
      { key: "em_andamento", label: "Em andamento", items: ongoing },
      { key: "concluida", label: "Concluídas", items: done },
    ].filter((g) => g.items.length > 0 || filterStatus === "all");
  }, [filtered, filterStatus]);

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Tarefas" description="Lista e filtros">
        <Button size="sm" onClick={openAdd}>
          <IconPlus data-icon="inline-start" />
          Nova tarefa
        </Button>
      </PageHeader>

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-4">
        {/* Filters */}
        <Card>
          <CardContent className="flex flex-wrap gap-3 py-3">
            <div className="flex items-center gap-2">
              <IconFilter className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Filtros
              </span>
            </div>
            <Select value={filterDisc} onValueChange={(v) => setFilterDisc(v ?? "all")}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue>{filterDisc === "all" ? "Todas as disciplinas" : (disciplinas.find(d => d.id === filterDisc)?.nome ?? "Disciplina")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as disciplinas</SelectItem>
                {disciplinas.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
              <SelectTrigger className="h-8 w-44 text-sm">
                <SelectValue>{filterStatus === "all" ? "Todos os status" : filterStatus === "pendente" ? "Pendente" : filterStatus === "em_andamento" ? "Em andamento" : "Concluída"}</SelectValue>
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
                    <h2 className="text-sm font-semibold text-foreground">
                      {group.label}
                    </h2>
                    <Badge variant="secondary">{group.items.length}</Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.items.map((tarefa) => {
                      const disc = discMap[tarefa.disciplinaId];
                      const days = today ? daysUntil(tarefa.prazo, today) : null;
                      const isOverdue =
                        days !== null && days < 0 && tarefa.status !== "concluida";

                      return (
                        <div
                          key={tarefa.id}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5",
                            tarefa.status === "concluida" && "opacity-60",
                          )}
                        >
                          {/* Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleTarefa(tarefa.id)}
                            className={cn(
                              "size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                              tarefa.status === "concluida"
                                ? "bg-primary border-primary"
                                : "border-muted-foreground hover:border-primary",
                            )}
                            aria-label="Alternar status"
                          >
                            {tarefa.status === "concluida" && (
                              <IconCheck className="size-3 text-primary-foreground" />
                            )}
                          </button>

                          {/* Content */}
                          <div className="flex flex-1 items-center gap-3 min-w-0 flex-wrap">
                            <span
                              className={cn(
                                "text-sm font-medium text-foreground truncate",
                                tarefa.status === "concluida" &&
                                  "line-through text-muted-foreground",
                              )}
                            >
                              {tarefa.titulo}
                            </span>
                            {disc && (
                              <span
                                className="text-xs px-1.5 py-0.5 rounded-sm font-medium text-white shrink-0"
                                style={{ backgroundColor: disc.cor }}
                              >
                                {disc.nome}
                              </span>
                            )}
                            <Badge variant={STATUS_VARIANTS[tarefa.status]}>
                              {STATUS_LABELS[tarefa.status]}
                            </Badge>
                          </div>

                          {/* Date */}
                          <span
                            className={cn(
                              "text-xs shrink-0 font-medium",
                              isOverdue
                                ? "text-destructive"
                                : "text-muted-foreground",
                            )}
                          >
                            {formatDateLabel(tarefa.prazo, today)}
                          </span>

                          {/* Actions */}
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => openEdit(tarefa)}
                            >
                              <IconEdit className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(tarefa.id)}
                            >
                              <IconTrash className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar tarefa" : "Nova tarefa"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da tarefa.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: Lista 3 – Derivadas"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Disciplina</Label>
                <Select
                  value={form.disciplinaId}
                  onValueChange={(v) => setForm({ ...form, disciplinaId: v ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="prazo">Prazo *</Label>
                <Input
                  id="prazo"
                  type="date"
                  value={form.prazo}
                  onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: (v ?? "pendente") as TarefaStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                placeholder="Detalhes opcionais..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Salvar alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
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
