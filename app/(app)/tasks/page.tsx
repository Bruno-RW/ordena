"use client";

import { IconListCheck, IconPlus } from "@tabler/icons-react";

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import TaskDeleteDialog from "@/app/(app)/tasks/_components/TaskDeleteDialog";
import TaskDialog, { TaskFormData } from "@/app/(app)/tasks/_components/TaskDialog";
import TaskFilters from "@/app/(app)/tasks/_components/TaskFilters";
import TaskItem from "@/app/(app)/tasks/_components/TaskItem";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/useData";
import { StatusEnum, Task } from "@/types/task";

const emptyForm: TaskFormData = {
  title: "",
  subjectId: "",
  deadline: "",
  status: StatusEnum.PENDING,
  description: "",
  score: undefined,
  weight: 1,
};

const TasksPage = () => {
  const { tasks, subjects, addTask, updateTask, deleteTask, toggleTask } = useData();

  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<TaskFormData>(emptyForm);

  const subjectMap = useMemo(() => Object.fromEntries(subjects.map((d) => [d.id, d])), [subjects]);

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => filterSubject === "all" || t.subjectId === filterSubject)
      .filter((t) => filterStatus === "all" || t.status === filterStatus)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [tasks, filterSubject, filterStatus]);

  const groups = useMemo(() => {
    return [
      {
        key: StatusEnum.PENDING,
        label: "Pendentes",
        items: filtered.filter((t) => t.status === StatusEnum.PENDING),
      },
      {
        key: StatusEnum.IN_PROGRESS,
        label: "Em andamento",
        items: filtered.filter((t) => t.status === StatusEnum.IN_PROGRESS),
      },
      {
        key: StatusEnum.COMPLETED,
        label: "Concluídas",
        items: filtered.filter((t) => t.status === StatusEnum.COMPLETED),
      },
    ].filter((g) => g.items.length > 0 || filterStatus === "all");
  }, [filtered, filterStatus]);

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, subjectId: subjects[0]?.id ?? "" });
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setForm({
      title: task.title,
      subjectId: task.subjectId,
      deadline: task.deadline,
      status: task.status,
      description: task.description ?? "",
      score: task.score,
      weight: task.weight ?? 1,
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

  return (
    <div className="flex flex-col flex-1">
      <Header title="Tarefas" description="Lista e filtros">
        <Button size="sm" onClick={openAdd}>
          <IconPlus data-icon="inline-start" />
          Nova tarefa
        </Button>
      </Header>

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-4">
        <TaskFilters
          subjects={subjects}
          filterSubject={filterSubject}
          filterStatus={filterStatus}
          onFilterSubjectChange={setFilterSubject}
          onFilterStatusChange={setFilterStatus}
          onClear={() => {
            setFilterSubject("all");
            setFilterStatus("all");
          }}
        />

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
                    {group.items.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        subject={subjectMap[task.subjectId]}
                        today={today}
                        onToggle={toggleTask}
                        onEdit={openEdit}
                        onDelete={setDeleteId}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        form={form}
        subjects={subjects}
        onFormChange={setForm}
        onSave={handleSave}
      />

      <TaskDeleteDialog
        deleteId={deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TasksPage;
