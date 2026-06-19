export type Disciplina = {
  id: string;
  nome: string;
  professor: string;
  horario: string;
  sala: string;
  cor: string;
};

export type Tarefa = {
  id: string;
  titulo: string;
  disciplinaId: string;
  prazo: string; // ISO date string
  status: "pendente" | "em_andamento" | "concluida";
  descricao?: string;
};

export type Nota = {
  id: string;
  disciplinaId: string;
  descricao: string;
  valor: number;
  peso: number;
};

export type Evento = {
  id: string;
  titulo: string;
  data: string; // ISO date string
  tipo: "tarefa" | "prova" | "evento";
  disciplinaId?: string;
};

export type Perfil = {
  nome: string;
  curso: string;
  semestre: number;
  avatarInitials: string;
};

export const disciplinasIniciais: Disciplina[] = [
  {
    id: "d1",
    nome: "Cálculo I",
    professor: "Prof. Eduardo Souza",
    horario: "Seg/Qua 08:00–09:40",
    sala: "Bloco A – 203",
    cor: "hsl(262,83%,58%)",
  },
  {
    id: "d2",
    nome: "Interação Humano-Computador",
    professor: "Prof. Aline Ferreira",
    horario: "Ter/Qui 10:00–11:40",
    sala: "Bloco B – 105",
    cor: "hsl(199,89%,48%)",
  },
  {
    id: "d3",
    nome: "Estruturas de Dados",
    professor: "Prof. Marcos Lima",
    horario: "Seg/Qua/Sex 14:00–14:50",
    sala: "Bloco C – 301",
    cor: "hsl(142,71%,45%)",
  },
  {
    id: "d4",
    nome: "Banco de Dados",
    professor: "Prof. Carla Mendes",
    horario: "Ter/Qui 14:00–15:40",
    sala: "Lab. BD – 102",
    cor: "hsl(30,95%,55%)",
  },
  {
    id: "d5",
    nome: "Engenharia de Software",
    professor: "Prof. Ricardo Nunes",
    horario: "Sex 08:00–11:40",
    sala: "Bloco D – 210",
    cor: "hsl(346,84%,61%)",
  },
];

export const tarefasIniciais: Tarefa[] = [
  {
    id: "t1",
    titulo: "Lista 3 – Derivadas",
    disciplinaId: "d1",
    prazo: "2026-06-20",
    status: "pendente",
    descricao: "Exercícios 1 a 15 da lista de derivadas.",
  },
  {
    id: "t2",
    titulo: "Protótipo de alta fidelidade",
    disciplinaId: "d2",
    prazo: "2026-06-25",
    status: "em_andamento",
    descricao: "Entregar protótipo no Figma com todas as telas.",
  },
  {
    id: "t3",
    titulo: "Implementação de Árvore AVL",
    disciplinaId: "d3",
    prazo: "2026-06-22",
    status: "pendente",
    descricao: "Implementar inserção, remoção e rotações.",
  },
  {
    id: "t4",
    titulo: "Modelagem ER do projeto",
    disciplinaId: "d4",
    prazo: "2026-06-18",
    status: "concluida",
    descricao: "Diagrama completo com relacionamentos.",
  },
  {
    id: "t5",
    titulo: "Documento de Requisitos",
    disciplinaId: "d5",
    prazo: "2026-06-30",
    status: "em_andamento",
    descricao: "SRS com casos de uso e diagrama de classes.",
  },
  {
    id: "t6",
    titulo: "Prova P1 – Cálculo",
    disciplinaId: "d1",
    prazo: "2026-06-28",
    status: "pendente",
  },
  {
    id: "t7",
    titulo: "Relatório de Usabilidade",
    disciplinaId: "d2",
    prazo: "2026-07-05",
    status: "pendente",
  },
  {
    id: "t8",
    titulo: "Implementação de Grafo",
    disciplinaId: "d3",
    prazo: "2026-07-10",
    status: "pendente",
  },
];

export const notasIniciais: Nota[] = [
  { id: "n1", disciplinaId: "d1", descricao: "P1", valor: 7.5, peso: 1 },
  { id: "n2", disciplinaId: "d1", descricao: "P2", valor: 8.0, peso: 1 },
  { id: "n3", disciplinaId: "d2", descricao: "Projeto", valor: 9.2, peso: 2 },
  { id: "n4", disciplinaId: "d2", descricao: "Prova", valor: 8.5, peso: 1 },
  { id: "n5", disciplinaId: "d3", descricao: "P1", valor: 6.5, peso: 1 },
  { id: "n6", disciplinaId: "d3", descricao: "P2", valor: 7.0, peso: 1 },
  { id: "n7", disciplinaId: "d4", descricao: "Trabalho", valor: 9.5, peso: 2 },
  { id: "n8", disciplinaId: "d4", descricao: "Prova", valor: 8.8, peso: 1 },
  { id: "n9", disciplinaId: "d5", descricao: "Requisitos", valor: 8.0, peso: 1 },
  { id: "n10", disciplinaId: "d5", descricao: "Projeto Final", valor: 8.7, peso: 2 },
];

export const perfilInicial: Perfil = {
  nome: "Bruno Silva",
  curso: "Ciência da Computação",
  semestre: 5,
  avatarInitials: "BS",
};
