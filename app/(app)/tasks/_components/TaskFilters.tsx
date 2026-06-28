"use client";

import { IconFilter } from "@tabler/icons-react";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Subject } from "@/types/subject";
import { StatusEnum } from "@/types/task";

interface TaskFiltersProps {
  subjects: Subject[];
  filterSubject: string;
  filterStatus: string;
  onFilterSubjectChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onClear: () => void;
}

const TaskFilters: FC<TaskFiltersProps> = ({
  subjects,
  filterSubject,
  filterStatus,
  onFilterSubjectChange,
  onFilterStatusChange,
  onClear,
}) => {
  const hasActiveFilters = filterSubject !== "all" || filterStatus !== "all";

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-3 py-3">
        <div className="flex items-center gap-2">
          <IconFilter className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filtros</span>
        </div>

        <Select value={filterSubject} onValueChange={(v) => onFilterSubjectChange(v ?? "all")}>
          <SelectTrigger className="h-8 w-44 text-sm">
            <SelectValue>
              {filterSubject === "all"
                ? "Todas as disciplinas"
                : (subjects.find((d) => d.id === filterSubject)?.name ?? "Disciplina")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="all">Todas as disciplinas</SelectItem>
            {subjects.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(v) => onFilterStatusChange(v ?? "all")}>
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
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value={StatusEnum.PENDING}>Pendente</SelectItem>
            <SelectItem value={StatusEnum.IN_PROGRESS}>Em andamento</SelectItem>
            <SelectItem value={StatusEnum.COMPLETED}>Concluída</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-xs">
            Limpar filtros
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
