"use client";

import { FC } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Médias por disciplina</CardTitle>
        <CardDescription>Visualização do desempenho semestral</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 32 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              height={34}
            />

            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: "var(--foreground)" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(15, 23, 42, 0.08)" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "12px",
                color: "var(--foreground)",
                backgroundColor: "var(--card)",
              }}
              itemStyle={{
                color: "var(--foreground)",
                fontSize: "12px",
              }}
              formatter={(value) => [typeof value === "number" ? value.toFixed(1) : value, "Média"]}
            />

            <Bar dataKey="average" radius={[4, 4, 0, 0]} cursor="pointer">
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
