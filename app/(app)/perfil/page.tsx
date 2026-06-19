"use client";

import { IconMoon, IconSun, IconUser } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/store";

export default function PerfilPage() {
  const { perfil, updatePerfil, disciplinas, tarefas, notas } = useStore();
  const { theme, setTheme } = useTheme();

  const [form, setForm] = useState({
    nome: perfil.nome,
    curso: perfil.curso,
    semestre: perfil.semestre,
  });

  // Sync when store changes externally
  useEffect(() => {
    setForm({
      nome: perfil.nome,
      curso: perfil.curso,
      semestre: perfil.semestre,
    });
  }, [perfil]);

  function getInitials(nome: string) {
    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  function handleSave() {
    if (!form.nome.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }
    updatePerfil({
      ...perfil,
      nome: form.nome,
      curso: form.curso,
      semestre: form.semestre,
      avatarInitials: getInitials(form.nome),
    });
    toast.success("Perfil atualizado.");
  }

  const concluidas = tarefas.filter((t) => t.status === "concluida").length;
  const mediaGeral = (() => {
    if (notas.length === 0) return null;
    const totalPeso = notas.reduce((a, n) => a + n.peso, 0);
    const soma = notas.reduce((a, n) => a + n.valor * n.peso, 0);
    return totalPeso > 0 ? (soma / totalPeso).toFixed(1) : null;
  })();

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Perfil" description="Configurações da conta" />

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6 max-w-2xl">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {getInitials(form.nome)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {perfil.nome}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {perfil.curso} · {perfil.semestre}º semestre
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Disciplinas", value: disciplinas.length },
            { label: "Tarefas concluídas", value: concluidas },
            { label: "Média geral", value: mediaGeral ?? "–" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-4 flex flex-col gap-1">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Editar informações
            </CardTitle>
            <CardDescription>
              Atualize seus dados pessoais e acadêmicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="curso">Curso</Label>
              <Input
                id="curso"
                value={form.curso}
                onChange={(e) => setForm({ ...form, curso: e.target.value })}
                placeholder="Ex: Ciência da Computação"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="semestre">Semestre atual</Label>
              <Input
                id="semestre"
                type="number"
                min={1}
                max={20}
                value={form.semestre}
                onChange={(e) =>
                  setForm({
                    ...form,
                    semestre: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <Button onClick={handleSave} className="self-start">
              Salvar alterações
            </Button>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Aparência</CardTitle>
            <CardDescription>
              Escolha entre tema claro e escuro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                  theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <IconSun className="size-5 text-foreground" />
                <span className="text-xs font-medium text-foreground">
                  Claro
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                  theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <IconMoon className="size-5 text-foreground" />
                <span className="text-xs font-medium text-foreground">
                  Escuro
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
