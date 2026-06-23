"use client";

import { Button } from "@/components/ui/button";
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
import { Subject } from "@/types/subject";
import { StatusEnum, Task } from "@/types/task";

export type TaskFormData = Omit<Task, "id">;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Task | null;
  form: TaskFormData;
  subjects: Subject[];
  onFormChange: (form: TaskFormData) => void;
  onSave: () => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  editing,
  form,
  subjects,
  onFormChange,
  onSave,
}: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          <DialogDescription>Preencha os dados da tarefa.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">Título *</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
              placeholder="Ex: Lista 3 – Derivadas"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Disciplina</Label>
              <Select
                value={form.subjectId}
                onValueChange={(v) => onFormChange({ ...form, subjectId: v ?? "" })}
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
              <Label htmlFor="task-deadline">Prazo *</Label>
              <Input
                id="task-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => onFormChange({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                onFormChange({ ...form, status: (v ?? StatusEnum.PENDING) as StatusEnum })
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
            <Label htmlFor="task-description">Descrição</Label>
            <Textarea
              id="task-description"
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              placeholder="Detalhes opcionais..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>{editing ? "Salvar alterações" : "Adicionar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
