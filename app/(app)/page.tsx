"use client";

import { useEffect, useMemo, useState } from "react";

import Header from "@/components/Header";
import { useData } from "@/hooks/useData";
import { StatusEnum } from "@/types/task";

import { DashboardStats } from "./_components/DashboardStats";
import { SemesterProgress } from "./_components/SemesterProgress";
import { SubjectsGrid } from "./_components/SubjectsGrid";
import { UpcomingTasks } from "./_components/UpcomingTasks";

export default function DashboardPage() {
  const { subjects, tasks, scores, profile } = useData();
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => setToday(new Date()), []);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.status === StatusEnum.COMPLETED).length;
    const pendingTasks = tasks.filter((t) => t.status === StatusEnum.PENDING).length;
    const inProgressTasks = tasks.filter((t) => t.status === StatusEnum.IN_PROGRESS).length;

    return {
      completedTasks,
      pendingTasks,
      inProgressTasks,
      totalTasks: tasks.length,
    };
  }, [tasks]);

  const nextTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== StatusEnum.COMPLETED)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [tasks]);

  const globalAverage = useMemo(() => {
    if (scores.length === 0) return 0;

    const totalWeight = scores.reduce((acc, n) => acc + n.weight, 0);
    const sum = scores.reduce((acc, n) => acc + n.value * n.weight, 0);

    return totalWeight > 0 ? sum / totalWeight : 0;
  }, [scores]);

  const subjectMap = useMemo(() => Object.fromEntries(subjects.map((d) => [d.id, d])), [subjects]);

  return (
    <div className="flex flex-col flex-1">
      <Header
        title={`Olá, ${profile.name.split(" ")[0]}`}
        description="Veja um resumo da sua semana acadêmica"
      />

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
        <DashboardStats
          subjectCount={subjects.length}
          openTaskCount={stats.pendingTasks + stats.inProgressTasks}
          completedTaskCount={stats.completedTasks}
          totalTaskCount={stats.totalTasks}
          globalAverage={globalAverage}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <SemesterProgress
            completedTasks={stats.completedTasks}
            totalTasks={stats.totalTasks}
            inProgressTasks={stats.inProgressTasks}
            pendingTasks={stats.pendingTasks}
          />

          <UpcomingTasks tasks={nextTasks} subjectMap={subjectMap} today={today} />
        </div>

        <SubjectsGrid subjects={subjects} tasks={tasks} />
      </main>
    </div>
  );
}
