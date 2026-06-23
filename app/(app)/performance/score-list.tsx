"use client";

import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Score } from "@/types/score";
import { Subject } from "@/types/subject";

interface SubjectScoreGroup {
  id: string;
  name: string;
  color: string;
  average: number | null;
}

interface ScoreListProps {
  filteredScores: Score[];
  subjectGroups: SubjectScoreGroup[];
  selectedSubject: string;
  subjects: Subject[];
  onSelectSubject: (value: string) => void;
  onAdd: () => void;
  onEdit: (score: Score) => void;
  onDelete: (id: string) => void;
}

function mediaColor(m: number | null): string {
  if (m === null) return "text-muted-foreground";
  if (m >= 7) return "text-emerald-600 dark:text-emerald-400";
  if (m >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-destructive";
}

export function ScoreList({
  filteredScores,
  subjectGroups,
  selectedSubject,
  subjects,
  onSelectSubject,
  onAdd,
  onEdit,
  onDelete,
}: ScoreListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <div>
          <CardTitle className="text-sm font-semibold">Registro de notas</CardTitle>
          <CardDescription>
            {filteredScores.length} nota{filteredScores.length !== 1 ? "s" : ""} registrada
            {filteredScores.length !== 1 ? "s" : ""}
          </CardDescription>
        </div>
        <Select value={selectedSubject} onValueChange={(v) => onSelectSubject(v ?? "all")}>
          <SelectTrigger className="h-8 w-48 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as disciplinas</SelectItem>
            {subjects.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {filteredScores.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground text-sm">
            <p>Nenhuma nota registrada.</p>
            <Button variant="outline" size="sm" onClick={onAdd}>
              <IconPlus data-icon="inline-start" />
              Registrar nota
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {subjectGroups.map((group) => {
              const groupScores = filteredScores.filter((n) => n.subjectId === group.id);
              if (groupScores.length === 0) return null;

              return (
                <div key={group.id} className="flex flex-col gap-2 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="text-sm font-semibold text-foreground">{group.name}</span>
                    </div>
                    {group.average !== null && (
                      <Badge
                        variant={
                          group.average >= 7
                            ? "default"
                            : group.average >= 5
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        Média: {group.average.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  {groupScores.map((score) => (
                    <div
                      key={score.id}
                      className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 ml-4"
                    >
                      <span className="flex-1 text-sm text-foreground">{score.description}</span>
                      <span className="text-xs text-muted-foreground">Peso {score.weight}</span>
                      <span className={cn("text-base font-bold w-10 text-right", mediaColor(score.value))}>
                        {score.value.toFixed(1)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => onEdit(score)}
                        >
                          <IconEdit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:text-destructive"
                          onClick={() => onDelete(score.id)}
                        >
                          <IconTrash className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
