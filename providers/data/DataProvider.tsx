"use client";

import { useCallback, useMemo, useState } from "react";

import DataContext from "@/context/DataContext";
import { mockProfile, mockScores, mockSubjects, mockTasks } from "@/lib/data/mock";
import { Profile } from "@/types/profile";
import { Score } from "@/types/score";
import { Subject } from "@/types/subject";
import { StatusEnum, Task } from "@/types/task";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [scores, setScores] = useState<Score[]>(mockScores);
  const [profile, setProfile] = useState<Profile>(mockProfile);

  const nextId = (prefix: string) =>
    `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  //? === === === Subject === === === ?//
  const addSubject = useCallback((d: Omit<Subject, "id">) => {
    setSubjects((prev) => [...prev, { ...d, id: nextId("d") }]);
  }, []);

  const updateSubject = useCallback((d: Subject) => {
    setSubjects((prev) => prev.map((x) => (x.id === d.id ? d : x)));
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((x) => x.id !== id));
    setTasks((prev) => prev.filter((x) => x.subjectId !== id));
    setScores((prev) => prev.filter((x) => x.subjectId !== id));
  }, []);

  //? === === === Tasks === === === ?//
  const addTask = useCallback((t: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...t, id: nextId("t") }]);
  }, []);

  const updateTask = useCallback((t: Task) => {
    setTasks((prev) => prev.map((x) => (x.id === t.id ? t : x)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status: x.status === StatusEnum.COMPLETED ? StatusEnum.PENDING : StatusEnum.COMPLETED,
            }
          : x
      )
    );
  }, []);

  //? === === === Scores === === === ?//
  const addScore = useCallback((n: Omit<Score, "id">) => {
    setScores((prev) => [...prev, { ...n, id: nextId("n") }]);
  }, []);

  const updateScore = useCallback((n: Score) => {
    setScores((prev) => prev.map((x) => (x.id === n.id ? n : x)));
  }, []);

  const deleteScore = useCallback((id: string) => {
    setScores((prev) => prev.filter((x) => x.id !== id));
  }, []);

  //? === === === Profile === === === ?//
  const updateProfile = useCallback((p: Profile) => setProfile(p), []);

  const value = useMemo(
    () => ({
      subjects,
      addSubject: addSubject,
      updateSubject: updateSubject,
      deleteSubject,

      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,

      scores,
      addScore,
      updateScore,
      deleteScore,

      profile,
      updateProfile,
    }),
    [
      subjects,
      addSubject,
      updateSubject,
      deleteSubject,

      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,

      scores,
      addScore,
      updateScore,
      deleteScore,

      profile,
      updateProfile,
    ]
  );

  return <DataContext.Provider value={value}> {children} </DataContext.Provider>;
}
