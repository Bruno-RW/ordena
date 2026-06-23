"use client";

import { IconPlus, IconTrophy } from "@tabler/icons-react";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { cn } from "@/lib/utils";
import { Score } from "@/types/score";

import { PerformanceChart } from "./performance-chart";
import { ScoreDeleteDialog } from "./score-delete-dialog";
import { ScoreDialog, ScoreFormData } from "./score-dialog";
import { ScoreList } from "./score-list";

const emptyForm: ScoreFormData = {
  subjectId: "",
  description: "",
  value: 0,
  weight: 1,
};

function subjectAverage(scores: Score[]): number | null {
  if (scores.length === 0) return null;
  const totalWeight = scores.reduce((a, n) => a + n.weight, 0);
  const sum = scores.reduce((a, n) => a + n.value * n.weight, 0);
  return totalWeight > 0 ? sum / totalWeight : null;
}

function mediaColor(m: number | null): string {
  if (m === null) return "text-muted-foreground";
  if (m >= 7) return "text-emerald-600 dark:text-emerald-400";
  if (m >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-destructive";
}

export default function PerformancePage() {
  const { scores, subjects, addScore, updateScore, deleteScore } = useData();

  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Score | null>(null);
  const [form, setForm] = useState<ScoreFormData>(emptyForm);

  const globalAverage = useMemo(() => subjectAverage(scores), [scores]);

  const subjectData = useMemo(() => {
    return subjects.map((d) => {
      const dns = scores.filter((n) => n.subjectId === d.id);
      return {
        id: d.id,
        name: d.name,
        color: d.color,
        average: subjectAverage(dns),
        dns,
      };
    });
  }, [subjects, scores]);

  const chartData = useMemo(
    () =>
      subjectData
        .filter((d) => d.average !== null)
        .map((d) => ({
          name: d.name.split(" ").slice(0, 2).join(" "),
          average: parseFloat((d.average ?? 0).toFixed(1)),
          color: d.color,
        })),
    [subjectData]
  );

  const filteredScores = useMemo(() => {
    if (selectedSubject === "all") return scores;
    return scores.filter((n) => n.subjectId === selectedSubject);
  }, [scores, selectedSubject]);

  function openAdd() {
    setEditing(null);
    setForm({
      ...emptyForm,
      subjectId: selectedSubject !== "all" ? selectedSubject : (subjects[0]?.id ?? ""),
    });
    setDialogOpen(true);
  }

  function openEdit(score: Score) {
    setEditing(score);
    setForm({
      subjectId: score.subjectId,
      description: score.description,
      value: score.value,
      weight: score.weight,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.description.trim()) {
      toast.error("A descrição é obrigatória.");
      return;
    }
    if (form.value < 0 || form.value > 10) {
      toast.error("A nota deve estar entre 0 e 10.");
      return;
    }
    if (editing) {
      updateScore({ ...editing, ...form });
      toast.success("Nota atualizada.");
    } else {
      addScore(form);
      toast.success("Nota adicionada.");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteScore(deleteId);
    toast.success("Nota removida.");
    setDeleteId(null);
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Desempenho" description="Notas e médias">
        <Button size="sm" onClick={openAdd}>
          <IconPlus data-icon="inline-start" />
          Registrar nota
        </Button>
      </Header>

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
        {/* Overview stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconTrophy className="size-3.5" />
                Média geral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn("text-4xl font-bold", mediaColor(globalAverage))}>
                {globalAverage !== null ? globalAverage.toFixed(1) : "–"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">de 10,0</p>
            </CardContent>
          </Card>

          {subjectData.slice(0, 3).map((d) => (
            <Card key={d.id}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5 truncate">
                  <div
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="truncate">{d.name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={cn("text-3xl font-bold", mediaColor(d.average))}>
                  {d.average !== null ? d.average.toFixed(1) : "–"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {d.dns.length} nota{d.dns.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <PerformanceChart data={chartData} />

        <ScoreList
          filteredScores={filteredScores}
          subjectGroups={subjectData}
          selectedSubject={selectedSubject}
          subjects={subjects}
          onSelectSubject={setSelectedSubject}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={setDeleteId}
        />
      </main>

      <ScoreDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        form={form}
        subjects={subjects}
        onFormChange={setForm}
        onSave={handleSave}
      />

      <ScoreDeleteDialog
        deleteId={deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
