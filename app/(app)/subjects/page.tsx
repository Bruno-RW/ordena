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

import { COLOR_OPTIONS } from "@/app/(app)/subjects/constants";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useData } from "@/hooks/useData";
import { Subject } from "@/types/subject";

type FormData = Omit<Subject, "id">;

const emptyForm: FormData = {
  name: "",
  professor: "",
  time: "",
  room: "",
  color: COLOR_OPTIONS[0],
};

export default function SubjectsPage() {
  const { subjects, tasks, scores, addSubject, updateSubject, deleteSubject } = useData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(d: Subject) {
    setEditing(d);
    setForm({ name: d.name, professor: d.professor, time: d.time, room: d.room, color: d.color });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("O nome da disciplina é obrigatório.");
      return;
    }
    if (editing) {
      updateSubject({ ...editing, ...form });
      toast.success("Disciplina atualizada.");
    } else {
      addSubject(form);
      toast.success("Disciplina adicionada.");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteSubject(deleteId);
    toast.success("Disciplina removida.");
    setDeleteId(null);
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Disciplinas" description="Semestre atual">
        <Button size="sm" onClick={openAdd}>
          <IconPlus data-icon="inline-start" />
          Nova disciplina
        </Button>
      </Header>

      <main className="flex-1 p-4 md:p-6">
        {subjects.length === 0 ? (
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
            {subjects.map((d) => {
              const minhasTarefas = tasks.filter((t) => t.subjectId === d.id);
              const minhasNotas = scores.filter((n) => n.subjectId === d.id);
              const media =
                minhasNotas.length > 0
                  ? (() => {
                      const totalPeso = minhasNotas.reduce((acc, n) => acc + n.weight, 0);
                      const soma = minhasNotas.reduce((acc, n) => acc + n.value * n.weight, 0);
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
                          style={{ backgroundColor: d.color }}
                        />
                        <CardTitle className="text-base leading-snug">{d.name}</CardTitle>
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
                        {d.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <IconDoor className="size-3.5 shrink-0" />
                        {d.room}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      <Badge variant="secondary">
                        {minhasTarefas.length} taref
                        {minhasTarefas.length === 1 ? "a" : "as"}
                      </Badge>
                      {media !== null && (
                        <Badge variant={media >= 7 ? "default" : "destructive"}>
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
            <DialogTitle>{editing ? "Editar disciplina" : "Nova disciplina"}</DialogTitle>
            <DialogDescription>Preencha os dados da disciplina.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Cálculo I"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="professor">Professor</Label>
              <Input
                id="professor"
                value={form.professor}
                onChange={(e) => setForm({ ...form, professor: e.target.value })}
                placeholder="Ex: Prof. Eduardo Souza"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="horario">Horário</Label>
                <Input
                  id="horario"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="Ex: Seg/Qua 08:00"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sala">Sala</Label>
                <Input
                  id="sala"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  placeholder="Ex: Bloco A – 201"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Cor</Label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setForm({ ...form, color: cor })}
                    className="size-7 rounded-full ring-offset-2 transition-all"
                    style={{
                      backgroundColor: cor,
                      boxShadow: form.color === cor ? `0 0 0 2px white, 0 0 0 4px ${cor}` : "none",
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
            <Button onClick={handleSave}>{editing ? "Salvar alterações" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover disciplina?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso também removerá todas as tarefas e notas vinculadas a ela. Esta ação não pode ser
              desfeita.
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
