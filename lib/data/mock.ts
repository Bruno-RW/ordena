import { Subject } from "@/types/subject";
import { Profile } from "@/types/profile";
import { Score } from "@/types/score";
import { StatusEnum, Task } from "@/types/task";

export const mockSubjects: Subject[] = [
  {
    id: "d1",
    name: "Cálculo I",
    professor: "Prof. Eduardo Souza",
    time: "Seg/Qua 08:00–09:40",
    room: "Bloco A – 203",
    color: "hsl(262,83%,58%)",
  },
  {
    id: "d2",
    name: "Interação Humano-Computador",
    professor: "Prof. Aline Ferreira",
    time: "Ter/Qui 10:00–11:40",
    room: "Bloco B – 105",
    color: "hsl(199,89%,48%)",
  },
  {
    id: "d3",
    name: "Estruturas de Dados",
    professor: "Prof. Marcos Lima",
    time: "Seg/Qua/Sex 14:00–14:50",
    room: "Bloco C – 301",
    color: "hsl(142,71%,45%)",
  },
  {
    id: "d4",
    name: "Banco de Dados",
    professor: "Prof. Carla Mendes",
    time: "Ter/Qui 14:00–15:40",
    room: "Lab. BD – 102",
    color: "hsl(30,95%,55%)",
  },
  {
    id: "d5",
    name: "Engenharia de Software",
    professor: "Prof. Ricardo Nunes",
    time: "Sex 08:00–11:40",
    room: "Bloco D – 210",
    color: "hsl(346,84%,61%)",
  },
];

export const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Lista 3 – Derivadas",
    subjectId: "d1",
    deadline: "2026-06-20",
    status: StatusEnum.PENDING,
    description: "Exercícios 1 a 15 da lista de derivadas.",
  },
  {
    id: "t2",
    title: "Protótipo de alta fidelidade",
    subjectId: "d2",
    deadline: "2026-06-25",
    status: StatusEnum.IN_PROGRESS,
    description: "Entregar protótipo no Figma com todas as telas.",
  },
  {
    id: "t3",
    title: "Implementação de Árvore AVL",
    subjectId: "d3",
    deadline: "2026-06-22",
    status: StatusEnum.PENDING,
    description: "Implementar inserção, remoção e rotações.",
  },
  {
    id: "t4",
    title: "Modelagem ER do projeto",
    subjectId: "d4",
    deadline: "2026-06-18",
    status: StatusEnum.COMPLETED,
    description: "Diagrama completo com relacionamentos.",
  },
  {
    id: "t5",
    title: "Documento de Requisitos",
    subjectId: "d5",
    deadline: "2026-06-30",
    status: StatusEnum.IN_PROGRESS,
    description: "SRS com casos de uso e diagrama de classes.",
  },
  {
    id: "t6",
    title: "Prova P1 – Cálculo",
    subjectId: "d1",
    deadline: "2026-06-28",
    status: StatusEnum.PENDING,
  },
  {
    id: "t7",
    title: "Relatório de Usabilidade",
    subjectId: "d2",
    deadline: "2026-07-05",
    status: StatusEnum.PENDING,
  },
  {
    id: "t8",
    title: "Implementação de Grafo",
    subjectId: "d3",
    deadline: "2026-07-10",
    status: StatusEnum.PENDING,
  },
];

export const mockScores: Score[] = [
  { id: "n1", subjectId: "d1", description: "P1", value: 7.5, weight: 1 },
  { id: "n2", subjectId: "d1", description: "P2", value: 8.0, weight: 1 },
  { id: "n3", subjectId: "d2", description: "Projeto", value: 9.2, weight: 2 },
  { id: "n4", subjectId: "d2", description: "Prova", value: 8.5, weight: 1 },
  { id: "n5", subjectId: "d3", description: "P1", value: 6.5, weight: 1 },
  { id: "n6", subjectId: "d3", description: "P2", value: 7.0, weight: 1 },
  { id: "n7", subjectId: "d4", description: "Trabalho", value: 9.5, weight: 2 },
  { id: "n8", subjectId: "d4", description: "Prova", value: 8.8, weight: 1 },
  { id: "n9", subjectId: "d5", description: "Requisitos", value: 8.0, weight: 1 },
  { id: "n10", subjectId: "d5", description: "Projeto Final", value: 8.7, weight: 2 },
];

export const mockProfile: Profile = {
  name: "Pedro Silva",
  course: "Ciência da Computação",
  semester: 5,
  avatarInitials: "PS",
};
