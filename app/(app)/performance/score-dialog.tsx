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
import { Score } from "@/types/score";
import { Subject } from "@/types/subject";

export type ScoreFormData = Omit<Score, "id">;

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Score | null;
  form: ScoreFormData;
  subjects: Subject[];
  onFormChange: (form: ScoreFormData) => void;
  onSave: () => void;
}

export function ScoreDialog({
  open,
  onOpenChange,
  editing,
  form,
  subjects,
  onFormChange,
  onSave,
}: ScoreDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Editar nota" : "Registrar nota"}</DialogTitle>
          <DialogDescription>Preencha os dados da nota.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
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
            <Label htmlFor="score-description">Avaliação *</Label>
            <Input
              id="score-description"
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              placeholder="Ex: Prova P1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="score-value">Nota (0–10)</Label>
              <Input
                id="score-value"
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={form.value}
                onChange={(e) => onFormChange({ ...form, value: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="score-weight">Peso</Label>
              <Input
                id="score-weight"
                type="number"
                min={1}
                max={5}
                step={1}
                value={form.weight}
                onChange={(e) => onFormChange({ ...form, weight: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>{editing ? "Salvar alterações" : "Registrar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
