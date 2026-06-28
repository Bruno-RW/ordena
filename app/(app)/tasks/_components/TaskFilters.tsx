"use client";

import { IconFilter } from "@tabler/icons-react";

import { FC } from "react";

import { statusLabel } from "@/app/(app)/tasks/_lib/constants";
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
  filterSubject: "all" | string;
  filterStatus: "all" | StatusEnum;
  onFilterSubjectChange: (value: "all" | string) => void;
  onFilterStatusChange: (value: "all" | StatusEnum) => void;
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

        <Select<"all" | string>
          value={filterSubject}
          onValueChange={(v) => onFilterSubjectChange(v ?? "all")}
        >
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

        <Select<"all" | StatusEnum>
          value={filterStatus}
          onValueChange={(v) => onFilterStatusChange(v ?? "all")}
        >
          <SelectTrigger className="h-8 w-44 text-sm">
            <SelectValue>{statusLabel(filterStatus)}</SelectValue>
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
