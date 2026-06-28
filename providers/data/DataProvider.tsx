"use client";

import { useCallback, useMemo, useState } from "react";

import DataContext from "@/context/DataContext";
import { mockProfile, mockSubjects, mockTasks } from "@/lib/data/mock";
import { Profile } from "@/types/profile";
import { Score } from "@/types/score";
import { Subject } from "@/types/subject";
import { StatusEnum, Task } from "@/types/task";

const createScoreFromTask = (task: Task): Score | null => {
  if (task.score === undefined) return null;

  return {
    id: task.id,
    subjectId: task.subjectId,
    description: task.title,
    value: task.score,
    weight: task.weight ?? 1,
  };
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [profile, setProfile] = useState<Profile>(mockProfile);

  const scores = useMemo(
    () => tasks.map(createScoreFromTask).filter((score): score is Score => score !== null),
    [tasks]
  );

  const nextId = (prefix: string) =>
    `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  //? === === === Subject === === === ?//
  const addSubject = useCallback((subject: Omit<Subject, "id">) => {
    setSubjects((subjects) => [...subjects, { ...subject, id: nextId("d") }]);
  }, []);

  const updateSubject = useCallback((subject: Subject) => {
    setSubjects((subjects) =>
      subjects.map((_subject) => (_subject.id === subject.id ? subject : _subject))
    );
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((subjects) => subjects.filter((subject) => subject.id !== id));
    setTasks((tasks) => tasks.filter((task) => task.subjectId !== id));
  }, []);

  //? === === === Tasks === === === ?//
  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks((tasks) => [...tasks, { ...task, id: nextId("t") }]);
  }, []);

  const updateTask = useCallback((task: Task) => {
    setTasks((tasks) => tasks.map((_task) => (_task.id === task.id ? task : _task)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === StatusEnum.COMPLETED ? StatusEnum.PENDING : StatusEnum.COMPLETED,
            }
          : task
      )
    );
  }, []);

  //? === === === Profile === === === ?//
  const updateProfile = useCallback((profile: Profile) => setProfile(profile), []);

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
      profile,
      updateProfile,
    ]
  );

  return <DataContext.Provider value={value}> {children} </DataContext.Provider>;
}
