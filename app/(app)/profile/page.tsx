"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

import { toast } from "sonner";

import Header from "@/components/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useData } from "@/hooks/useData";
import { StatusEnum } from "@/types/task";

const ProfilePage = () => {
  const { profile, updateProfile, subjects, tasks, scores } = useData();
  const { theme, setTheme } = useTheme();

  const [form, setForm] = useState({
    name: profile.name,
    course: profile.course,
    semester: profile.semester,
  });

  // Sync when store changes externally
  useEffect(() => {
    setForm({
      name: profile.name,
      course: profile.course,
      semester: profile.semester,
    });
  }, [profile]);

  function getInitials(nome: string) {
    return nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }
    updateProfile({
      ...profile,
      name: form.name,
      course: form.course,
      semester: form.semester,
      avatarInitials: getInitials(form.name),
    });
    toast.success("Perfil atualizado.");
  }

  const completedTasks = tasks.filter((t) => t.status === StatusEnum.COMPLETED).length;
  const globalAverage = (() => {
    if (scores.length === 0) return null;

    const totalWeight = scores.reduce((a, n) => a + n.weight, 0);
    const sum = scores.reduce((a, n) => a + n.value * n.weight, 0);

    return totalWeight > 0 ? (sum / totalWeight).toFixed(1) : null;
  })();

  return (
    <div className="flex flex-col flex-1">
      <Header title="Perfil" description="Configurações da conta" />

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {getInitials(form.name)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-lg font-semibold text-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {profile.course} · {profile.semester}º semestre
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Disciplinas", value: subjects.length },
            { label: "Tarefas concluídas", value: completedTasks },
            { label: "Média geral", value: globalAverage ?? "–" },
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
            <CardTitle className="text-sm font-semibold">Editar informações</CardTitle>
            <CardDescription>Atualize seus dados pessoais e acadêmicos.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Seu nome"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                placeholder="Ex: Ciência da Computação"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="semester">Semestre atual</Label>
              <Input
                id="semester"
                type="number"
                min={1}
                max={20}
                value={form.semester}
                onChange={(e) =>
                  setForm({
                    ...form,
                    semester: parseInt(e.target.value) || 1,
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
            <CardDescription>Escolha entre tema claro e escuro.</CardDescription>
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
                <span className="text-xs font-medium text-foreground">Claro</span>
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
                <span className="text-xs font-medium text-foreground">Escuro</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;
