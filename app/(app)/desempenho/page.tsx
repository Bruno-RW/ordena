"use client";

import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconTrophy,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useStore } from "@/context/store";
import type { Nota } from "@/data/mock";
import { cn } from "@/lib/utils";

type FormData = Omit<Nota, "id">;

const emptyForm: FormData = {
  disciplinaId: "",
  descricao: "",
  valor: 0,
  peso: 1,
};

function mediaDisc(notas: Nota[]) {
  if (notas.length === 0) return null;
  const totalPeso = notas.reduce((a, n) => a + n.peso, 0);
  const soma = notas.reduce((a, n) => a + n.valor * n.peso, 0);
  return totalPeso > 0 ? soma / totalPeso : null;
}

export default function DesempenhoPage() {
  const { notas, disciplinas, addNota, updateNota, deleteNota } = useStore();

  const [selectedDisc, setSelectedDisc] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Nota | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const discMap = useMemo(
    () => Object.fromEntries(disciplinas.map((d) => [d.id, d])),
    [disciplinas],
  );

  const mediaGeral = useMemo(() => mediaDisc(notas), [notas]);

  const discData = useMemo(() => {
    return disciplinas.map((d) => {
      const dns = notas.filter((n) => n.disciplinaId === d.id);
      const media = mediaDisc(dns);
      return { id: d.id, nome: d.nome, cor: d.cor, media, notas: dns };
    });
  }, [disciplinas, notas]);

  const chartData = useMemo(
    () =>
      discData
        .filter((d) => d.media !== null)
        .map((d) => ({
          nome: d.nome.split(" ").slice(0, 2).join(" "),
          media: parseFloat((d.media ?? 0).toFixed(1)),
          cor: d.cor,
        })),
    [discData],
  );

  const filteredNotas = useMemo(() => {
    if (selectedDisc === "all") return notas;
    return notas.filter((n) => n.disciplinaId === selectedDisc);
  }, [notas, selectedDisc]);

  function openAdd() {
    setEditing(null);
    setForm({
      ...emptyForm,
      disciplinaId:
        selectedDisc !== "all" ? selectedDisc : disciplinas[0]?.id ?? "",
    });
    setDialogOpen(true);
  }

  function openEdit(n: Nota) {
    setEditing(n);
    setForm({
      disciplinaId: n.disciplinaId,
      descricao: n.descricao,
      valor: n.valor,
      peso: n.peso,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.descricao.trim()) {
      toast.error("A descrição é obrigatória.");
      return;
    }
    if (form.valor < 0 || form.valor > 10) {
      toast.error("A nota deve estar entre 0 e 10.");
      return;
    }
    if (editing) {
      updateNota({ ...editing, ...form });
      toast.success("Nota atualizada.");
    } else {
      addNota(form);
      toast.success("Nota adicionada.");
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteNota(deleteId);
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
      <PageHeader title="Desempenho" description="Notas e médias">
        <Button size="sm" onClick={openAdd}>
          <IconPlus data-icon="inline-start" />
          Registrar nota
        </Button>
      </PageHeader>

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
              <p
                className={cn(
                  "text-4xl font-bold",
                  mediaColor(mediaGeral),
                )}
              >
                {mediaGeral !== null ? mediaGeral.toFixed(1) : "–"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                de 10,0
              </p>
            </CardContent>
          </Card>

          {discData.slice(0, 3).map((d) => (
            <Card key={d.id}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5 truncate">
                  <div
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.cor }}
                  />
                  <span className="truncate">{d.nome}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p
                  className={cn(
                    "text-3xl font-bold",
                    mediaColor(d.media),
                  )}
                >
                  {d.media !== null ? d.media.toFixed(1) : "–"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {d.notas.length} nota{d.notas.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Médias por disciplina
              </CardTitle>
              <CardDescription>
                Visualização do desempenho semestral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border) / 0.5)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="nome"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
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
                    formatter={(v: number) => [v.toFixed(1), "Média"]}
                  />
                  <Bar dataKey="media" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.cor} />
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
              <CardTitle className="text-sm font-semibold">
                Registro de notas
              </CardTitle>
              <CardDescription>
                {filteredNotas.length} nota
                {filteredNotas.length !== 1 ? "s" : ""} registrada
                {filteredNotas.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Select value={selectedDisc} onValueChange={setSelectedDisc}>
              <SelectTrigger className="h-8 w-48 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as disciplinas</SelectItem>
                {disciplinas.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {filteredNotas.length === 0 ? (
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
                {discData.map((d) => {
                  const dns = filteredNotas.filter(
                    (n) => n.disciplinaId === d.id,
                  );
                  if (dns.length === 0) return null;
                  const media = mediaDisc(dns);
                  return (
                    <div key={d.id} className="flex flex-col gap-2 mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: d.cor }}
                          />
                          <span className="text-sm font-semibold text-foreground">
                            {d.nome}
                          </span>
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
                          <span className="flex-1 text-sm text-foreground">
                            {n.descricao}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Peso {n.peso}
                          </span>
                          <span
                            className={cn(
                              "text-base font-bold w-10 text-right",
                              mediaColor(n.valor),
                            )}
                          >
                            {n.valor.toFixed(1)}
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
            <DialogDescription>
              Preencha os dados da nota.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Disciplina</Label>
              <Select
                value={form.disciplinaId}
                onValueChange={(v) => setForm({ ...form, disciplinaId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descricao">Avaliação *</Label>
              <Input
                id="descricao"
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
                placeholder="Ex: Prova P1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="valor">Nota (0–10)</Label>
                <Input
                  id="valor"
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={form.valor}
                  onChange={(e) =>
                    setForm({ ...form, valor: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="peso">Peso</Label>
                <Input
                  id="peso"
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={form.peso}
                  onChange={(e) =>
                    setForm({ ...form, peso: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Salvar alterações" : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover nota?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
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
