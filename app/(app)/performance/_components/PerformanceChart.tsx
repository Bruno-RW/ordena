"use client";

import { FC } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartEntry {
  name: string;
  average: number;
  color: string;
}

interface PerformanceChartProps {
  data: ChartEntry[];
}

const PerformanceChart: FC<PerformanceChartProps> = ({ data }) => {
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 32 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />

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

            <Bar dataKey="average" radius={[4, 4, 0, 0]} cursor="pointer">
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}

              <LabelList
                dataKey="average"
                position="top"
                formatter={(v) => (typeof v === "number" ? v.toFixed(1) : String(v))}
                style={{ fontSize: 12, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
