"use client";

import {
  IconChalkboard,
  IconClock,
  IconDoor,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
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
import { useStore } from "@/context/store";
import type { Disciplina } from "@/data/mock";

const COR_OPCOES = [
  "hsl(262,83%,58%)",
  "hsl(199,89%,48%)",
  "hsl(142,71%,45%)",
  "hsl(30,95%,55%)",
  "hsl(346,84%,61%)",
  "hsl(42,100%,60%)",
  "hsl(172,66%,50%)",
  "hsl(288,72%,60%)",
];

type FormData = Omit<Disciplina, "id">;

const emptyForm: FormData = {
  nome: "",
  professor: "",
  horario: "",
  sala: "",
  cor: COR_OPCOES[0],
};

export default function DisciplinasPage() {
  const { disciplinas, tarefas, notas, addDisciplina, updateDisciplina, deleteDisciplina } =
    useStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Disciplina | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(d: Disciplina) {
    setEditing(d);
    setForm({ nome: d.nome, professor: d.professor, horario: d.horario, sala: d.sala, cor: d.cor });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.nome.trim()) {
      toast.error("O nome da disciplina é obrigatório.");
      return;
    }
    if (editing) {
      updateDisciplina({ ...editing, ...form });
      toast.success("Disciplina atualizada.");
    } else {
      addDisciplina(form);
      toast.success("Disciplina adicionada.");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteDisciplina(deleteId);
    toast.success("Disciplina removida.");
    setDeleteId(null);
  }

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Disciplinas" description="Semestre atual">
        <Button size="sm" onClick={openAdd}>
          <IconPlus data-icon="inline-start" />
          Nova disciplina
        </Button>
      </PageHeader>

      <main className="flex-1 p-4 md:p-6">
        {disciplinas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <IconChalkboard className="size-12 opacity-30" />
            <p className="text-sm">Nenhuma disciplina cadastrada.</p>
            <Button variant="outline" size="sm" onClick={openAdd}>
              <IconPlus data-icon="inline-start" />
              Adicionar disciplina
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {disciplinas.map((d) => {
              const minhasTarefas = tarefas.filter(
                (t) => t.disciplinaId === d.id,
              );
              const minhasNotas = notas.filter((n) => n.disciplinaId === d.id);
              const media =
                minhasNotas.length > 0
                  ? (() => {
                      const totalPeso = minhasNotas.reduce(
                        (acc, n) => acc + n.peso,
                        0,
                      );
                      const soma = minhasNotas.reduce(
                        (acc, n) => acc + n.valor * n.peso,
                        0,
                      );
                      return totalPeso > 0 ? soma / totalPeso : null;
                    })()
                  : null;

              return (
                <Card key={d.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="size-3 shrink-0 rounded-full mt-0.5"
                          style={{ backgroundColor: d.cor }}
                        />
                        <CardTitle className="text-base leading-snug">
                          {d.nome}
                        </CardTitle>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => openEdit(d)}
                        >
                          <IconEdit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(d.id)}
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
                        {d.professor}
                      </span>
                      <span className="flex items-center gap-2">
                        <IconClock className="size-3.5 shrink-0" />
                        {d.horario}
                      </span>
                      <span className="flex items-center gap-2">
                        <IconDoor className="size-3.5 shrink-0" />
                        {d.sala}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      <Badge variant="secondary">
                        {minhasTarefas.length} taref
                        {minhasTarefas.length === 1 ? "a" : "as"}
                      </Badge>
                      {media !== null && (
                        <Badge
                          variant={media >= 7 ? "default" : "destructive"}
                        >
                          Média: {media.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar disciplina" : "Nova disciplina"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da disciplina.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Cálculo I"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="professor">Professor</Label>
              <Input
                id="professor"
                value={form.professor}
                onChange={(e) =>
                  setForm({ ...form, professor: e.target.value })
                }
                placeholder="Ex: Prof. Eduardo Souza"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="horario">Horário</Label>
                <Input
                  id="horario"
                  value={form.horario}
                  onChange={(e) =>
                    setForm({ ...form, horario: e.target.value })
                  }
                  placeholder="Ex: Seg/Qua 08:00"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sala">Sala</Label>
                <Input
                  id="sala"
                  value={form.sala}
                  onChange={(e) => setForm({ ...form, sala: e.target.value })}
                  placeholder="Ex: Bloco A – 201"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Cor</Label>
              <div className="flex gap-2 flex-wrap">
                {COR_OPCOES.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setForm({ ...form, cor })}
                    className="size-7 rounded-full ring-offset-2 transition-all"
                    style={{
                      backgroundColor: cor,
                      boxShadow:
                        form.cor === cor ? `0 0 0 2px white, 0 0 0 4px ${cor}` : "none",
                    }}
                    aria-label={`Cor ${cor}`}
                  />
                ))}
              </div>
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

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover disciplina?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso também removerá todas as tarefas e notas vinculadas a ela.
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
