"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartEntry {
  name: string;
  average: number;
  color: string;
}

interface PerformanceChartProps {
  data: ChartEntry[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (data.length === 0) return null;

  const chartConfig = data.reduce<ChartConfig>((acc, entry) => {
    acc[entry.name] = { label: entry.name, color: entry.color };
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Médias por disciplina</CardTitle>
        <CardDescription>Visualização do desempenho semestral</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
          <BarChart
            data={data}
            margin={{ top: 24, right: 8, left: -20, bottom: 48 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={false}
              tickMargin={8}
              label={undefined}
            />
            <YAxis
              domain={[0, 10]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickCount={6}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    typeof value === "number" ? value.toFixed(1) : value,
                    "Média",
                  ]}
                  hideLabel
                />
              }
            />
            <Bar dataKey="average" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
              <LabelList
                dataKey="average"
                position="top"
                formatter={(v: number) => v.toFixed(1)}
                style={{ fontSize: 11, fontWeight: 600, fill: "hsl(var(--foreground))" }}
              />
              <LabelList
                dataKey="name"
                position="bottom"
                offset={12}
                style={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                formatter={(v: string) =>
                  v.length > 12 ? v.slice(0, 12) + "…" : v
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
