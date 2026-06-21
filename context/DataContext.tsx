"use client";

import { createContext } from "react";

import { Profile } from "@/types/profile";
import { Score } from "@/types/score";
import { Subject } from "@/types/subject";
import { Task } from "@/types/task";

export type DataContextProps = {
  //? === === === Subjects === === === ?//
  subjects: Subject[];
  addSubject(subject: Omit<Subject, "id">): void;
  updateSubject(d: Subject): void;
  deleteSubject(id: string): void;

  //? === === === Tasks === === === ?//
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  //? === === === Scores === === === ?//
  scores: Score[];
  addScore: (score: Omit<Score, "id">) => void;
  updateScore: (score: Score) => void;
  deleteScore: (id: string) => void;

  //? === === === Profile === === === ?//
  profile: Profile;
  updateProfile: (profile: Profile) => void;
};

const DataContext = createContext<DataContextProps | null>(null);
export default DataContext;
