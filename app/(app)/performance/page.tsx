"use client";

import { IconTrophy } from "@tabler/icons-react";

import { useMemo, useState } from "react";

import PerformanceChart from "@/app/(app)/performance/_components/PerformanceChart";
import ScoreList from "@/app/(app)/performance/_components/ScoreList";
import { mediaColor, subjectAverage } from "@/app/(app)/performance/_lib/utils";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import { cn } from "@/lib/utils";

const PerformancePage = () => {
  const { scores, subjects } = useData();

  const [selectedSubject, setSelectedSubject] = useState("all");

  const globalAverage = useMemo(() => subjectAverage(scores), [scores]);

  const subjectData = useMemo(() => {
    return subjects.map((d) => {
      const subjectScores = scores.filter((score) => score.subjectId === d.id);

      return {
        id: d.id,
        name: d.name,
        color: d.color,
        average: subjectAverage(subjectScores),
        subjectScores,
      };
    });
  }, [subjects, scores]);

  const chartData = useMemo(
    () =>
      subjectData
        .filter((d) => d.average !== null)
        .map((d) => ({
          name: d.name,
          average: parseFloat((d.average ?? 0).toFixed(1)),
          color: d.color,
        })),
    [subjectData]
  );

  const filteredScores = useMemo(() => {
    if (selectedSubject === "all") return scores;
    return scores.filter((n) => n.subjectId === selectedSubject);
  }, [scores, selectedSubject]);

  return (
    <div className="flex flex-col flex-1">
      <Header title="Desempenho" description="Notas e médias" />

      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6">
        {/* Overview stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <IconTrophy className="size-3.5" />
                Média geral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn("text-4xl font-bold", mediaColor(globalAverage))}>
                {globalAverage !== null ? globalAverage.toFixed(1) : "–"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">de 10,0</p>
            </CardContent>
          </Card>

          {subjectData.slice(0, 3).map((d) => (
            <Card key={d.id}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5 truncate">
                  <div
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="truncate">{d.name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className={cn("text-3xl font-bold", mediaColor(d.average))}>
                  {d.average !== null ? d.average.toFixed(1) : "–"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {d.subjectScores.length} nota{d.subjectScores.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <PerformanceChart data={chartData} />

        <ScoreList
          filteredScores={filteredScores}
          subjectGroups={subjectData}
          selectedSubject={selectedSubject}
          subjects={subjects}
          onSelectSubject={setSelectedSubject}
        />
      </main>
    </div>
  );
};

export default PerformancePage;
