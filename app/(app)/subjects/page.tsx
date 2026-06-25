"use client";

import { IconChalkboard, IconPlus } from "@tabler/icons-react";

import { useState } from "react";

import { toast } from "sonner";

import { SubjectCard } from "@/app/(app)/subjects/_components/SubjectCard";
import { SubjectDeleteDialog } from "@/app/(app)/subjects/_components/SubjectDeleteDialog";
import { SubjectDialog, SubjectFormData } from "@/app/(app)/subjects/_components/SubjectDialog";
import { COLOR_OPTIONS } from "@/app/(app)/subjects/_lib/constants";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/useData";
import { Subject } from "@/types/subject";

const emptyForm: SubjectFormData = {
  name: "",
  professor: "",
  time: "",
  room: "",
  color: COLOR_OPTIONS[0],
};

const SubjectsPage = () => {
  const { subjects, tasks, scores, addSubject, updateSubject, deleteSubject } = useData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState<SubjectFormData>(emptyForm);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(subject: Subject) {
    setEditing(subject);
    setForm({
      name: subject.name,
      professor: subject.professor,
      time: subject.time,
      room: subject.room,
      color: subject.color,
    });
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
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                tasks={tasks}
                scores={scores}
                onEdit={openEdit}
                onDelete={setDeleteId}
              />
            ))}
          </div>
        )}
      </main>

      <SubjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        form={form}
        onFormChange={setForm}
        onSave={handleSave}
      />

      <SubjectDeleteDialog
        deleteId={deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SubjectsPage;
