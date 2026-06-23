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
import { Subject } from "@/types/subject";

import { COLOR_OPTIONS } from "../_lib/constants";

export type SubjectFormData = Omit<Subject, "id">;

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Subject | null;
  form: SubjectFormData;
  onFormChange: (form: SubjectFormData) => void;
  onSave: () => void;
}

export function SubjectDialog({
  open,
  onOpenChange,
  editing,
  form,
  onFormChange,
  onSave,
}: SubjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Editar disciplina" : "Nova disciplina"}</DialogTitle>
          <DialogDescription>Preencha os dados da disciplina.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject-name">Nome *</Label>
            <Input
              id="subject-name"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="Ex: Cálculo I"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject-professor">Professor</Label>
            <Input
              id="subject-professor"
              value={form.professor}
              onChange={(e) => onFormChange({ ...form, professor: e.target.value })}
              placeholder="Ex: Prof. Eduardo Souza"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject-time">Horário</Label>
              <Input
                id="subject-time"
                value={form.time}
                onChange={(e) => onFormChange({ ...form, time: e.target.value })}
                placeholder="Ex: Seg/Qua 08:00"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject-room">Sala</Label>
              <Input
                id="subject-room"
                value={form.room}
                onChange={(e) => onFormChange({ ...form, room: e.target.value })}
                placeholder="Ex: Bloco A – 201"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Cor</Label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onFormChange({ ...form, color })}
                  className="size-7 rounded-full ring-offset-2 transition-all"
                  style={{
                    backgroundColor: color,
                    boxShadow:
                      form.color === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : "none",
                  }}
                  aria-label={`Cor ${color}`}
                />
              ))}
            </div>
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
