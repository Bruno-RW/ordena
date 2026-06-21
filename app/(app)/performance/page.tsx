"use client";

import { IconEdit, IconPlus, IconTrash, IconTrophy } from "@tabler/icons-react";

import { useMemo, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useData } from "@/hooks/useData";
import { cn } from "@/lib/utils";
import { Score } from "@/types/score";

type FormData = Omit<Score, "id">;

const emptyForm: FormData = {
  subjectId: "",
  description: "",
  value: 0,
  weight: 1,
};

function subjectAverage(scores: Score[]) {
  if (scores.length === 0) return null;

  const totalWeight = scores.reduce((a, n) => a + n.weight, 0);
  const sum = scores.reduce((a, n) => a + n.value * n.weight, 0);

  return totalWeight > 0 ? sum / totalWeight : null;
}

export default function DesempenhoPage() {
  const { scores, subjects, addScore, updateScore, deleteScore } = useData();

  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Score | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const subjectMap = useMemo(() => Object.fromEntries(subjects.map((d) => [d.id, d])), [subjects]);

  const globalAverage = useMemo(() => subjectAverage(scores), [scores]);

  const subjectData = useMemo(() => {
    return subjects.map((d) => {
      const dns = scores.filter((n) => n.subjectId === d.id);
      const average = subjectAverage(dns);

      return {
        id: d.id,
        name: d.name,
        color: d.color,
        average,
        scores,
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

  function openEdit(n: Score) {
    setEditing(n);
    setForm({
      subjectId: n.subjectId,
      description: n.description,
      value: n.value,
      weight: n.weight,
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

  const mediaColor = (m: number | null) => {
    if (m === null) return "text-muted-foreground";
    if (m >= 7) return "text-emerald-600 dark:text-emerald-400";
    if (m >= 5) return "text-amber-600 dark:text-amber-400";
    return "text-destructive";
  };

  return (
    <div className="flex flex-col flex-1">
      <Header title="Desempenho" description="Notas e médias">
        <Button size="sm" onClick={openAdd}>
          <IconPlus data-icon="inline-start" />
          Registrar nota
        </Button>
      </Header>

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
        {/* Overview */}
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
                  {d.scores.length} nota{d.scores.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Médias por disciplina</CardTitle>
              <CardDescription>Visualização do desempenho semestral</CardDescription>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border) / 0.5)"
                    vertical={false}
                  />

                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />

                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                    formatter={(v) => [typeof v === "number" ? v.toFixed(1) : v, "Média"]}
                  />

                  <Bar dataKey="media" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Notes table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-sm font-semibold">Registro de notas</CardTitle>
              <CardDescription>
                {filteredScores.length} nota
                {filteredScores.length !== 1 ? "s" : ""} registrada
                {filteredScores.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>

            <Select value={selectedSubject} onValueChange={(v) => setSelectedSubject(v ?? "all")}>
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
                <Button variant="outline" size="sm" onClick={openAdd}>
                  <IconPlus data-icon="inline-start" />
                  Registrar nota
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Group by disciplina */}
                {subjectData.map((d) => {
                  const dns = filteredScores.filter((n) => n.subjectId === d.id);
                  if (dns.length === 0) return null;
                  const media = subjectAverage(dns);
                  return (
                    <div key={d.id} className="flex flex-col gap-2 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="text-sm font-semibold text-foreground">{d.name}</span>
                        </div>
                        {media !== null && (
                          <Badge
                            variant={
                              media >= 7 ? "default" : media >= 5 ? "secondary" : "destructive"
                            }
                          >
                            Média: {media.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      {dns.map((n) => (
                        <div
                          key={n.id}
                          className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 ml-4"
                        >
                          <span className="flex-1 text-sm text-foreground">{n.description}</span>
                          <span className="text-xs text-muted-foreground">Peso {n.weight}</span>
                          <span
                            className={cn(
                              "text-base font-bold w-10 text-right",
                              mediaColor(n.value)
                            )}
                          >
                            {n.value.toFixed(1)}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => openEdit(n)}
                            >
                              <IconEdit className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(n.id)}
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
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                onValueChange={(v) => setForm({ ...form, subjectId: v ?? "" })}
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
              <Label htmlFor="descricao">Avaliação *</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ex: Prova P1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="value">Nota (0–10)</Label>
                <Input
                  id="value"
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="weight">Peso</Label>
                <Input
                  id="peso"
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editing ? "Salvar alterações" : "Registrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover nota?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
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
