"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  disciplinasIniciais,
  notasIniciais,
  perfilInicial,
  tarefasIniciais,
} from "@/data/mock";
import type { Disciplina, Nota, Perfil, Tarefa } from "@/data/mock";

// ─── Types ──────────────────────────────────────────────────────────────────

type StoreContextValue = {
  // Disciplinas
  disciplinas: Disciplina[];
  addDisciplina: (d: Omit<Disciplina, "id">) => void;
  updateDisciplina: (d: Disciplina) => void;
  deleteDisciplina: (id: string) => void;

  // Tarefas
  tarefas: Tarefa[];
  addTarefa: (t: Omit<Tarefa, "id">) => void;
  updateTarefa: (t: Tarefa) => void;
  deleteTarefa: (id: string) => void;
  toggleTarefa: (id: string) => void;

  // Notas
  notas: Nota[];
  addNota: (n: Omit<Nota, "id">) => void;
  updateNota: (n: Nota) => void;
  deleteNota: (id: string) => void;

  // Perfil
  perfil: Perfil;
  updatePerfil: (p: Perfil) => void;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const StoreContext = createContext<StoreContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [disciplinas, setDisciplinas] =
    useState<Disciplina[]>(disciplinasIniciais);
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasIniciais);
  const [notas, setNotas] = useState<Nota[]>(notasIniciais);
  const [perfil, setPerfil] = useState<Perfil>(perfilInicial);

  const nextId = (prefix: string) =>
    `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // ── Disciplinas ────────────────────────────────────────────────────────────
  const addDisciplina = useCallback((d: Omit<Disciplina, "id">) => {
    setDisciplinas((prev) => [...prev, { ...d, id: nextId("d") }]);
  }, []);

  const updateDisciplina = useCallback((d: Disciplina) => {
    setDisciplinas((prev) => prev.map((x) => (x.id === d.id ? d : x)));
  }, []);

  const deleteDisciplina = useCallback((id: string) => {
    setDisciplinas((prev) => prev.filter((x) => x.id !== id));
    setTarefas((prev) => prev.filter((x) => x.disciplinaId !== id));
    setNotas((prev) => prev.filter((x) => x.disciplinaId !== id));
  }, []);

  // ── Tarefas ────────────────────────────────────────────────────────────────
  const addTarefa = useCallback((t: Omit<Tarefa, "id">) => {
    setTarefas((prev) => [...prev, { ...t, id: nextId("t") }]);
  }, []);

  const updateTarefa = useCallback((t: Tarefa) => {
    setTarefas((prev) => prev.map((x) => (x.id === t.id ? t : x)));
  }, []);

  const deleteTarefa = useCallback((id: string) => {
    setTarefas((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toggleTarefa = useCallback((id: string) => {
    setTarefas((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status:
                x.status === "concluida"
                  ? "pendente"
                  : "concluida",
            }
          : x,
      ),
    );
  }, []);

  // ── Notas ──────────────────────────────────────────────────────────────────
  const addNota = useCallback((n: Omit<Nota, "id">) => {
    setNotas((prev) => [...prev, { ...n, id: nextId("n") }]);
  }, []);

  const updateNota = useCallback((n: Nota) => {
    setNotas((prev) => prev.map((x) => (x.id === n.id ? n : x)));
  }, []);

  const deleteNota = useCallback((id: string) => {
    setNotas((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // ── Perfil ─────────────────────────────────────────────────────────────────
  const updatePerfil = useCallback((p: Perfil) => {
    setPerfil(p);
  }, []);

  const value = useMemo(
    () => ({
      disciplinas,
      addDisciplina,
      updateDisciplina,
      deleteDisciplina,
      tarefas,
      addTarefa,
      updateTarefa,
      deleteTarefa,
      toggleTarefa,
      notas,
      addNota,
      updateNota,
      deleteNota,
      perfil,
      updatePerfil,
    }),
    [
      disciplinas,
      addDisciplina,
      updateDisciplina,
      deleteDisciplina,
      tarefas,
      addTarefa,
      updateTarefa,
      deleteTarefa,
      toggleTarefa,
      notas,
      addNota,
      updateNota,
      deleteNota,
      perfil,
      updatePerfil,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
