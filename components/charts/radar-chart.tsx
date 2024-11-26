"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TStats } from "@/lib/types";
import {
  calculateAchievedPercentage,
  calculateTotalCompletion,
  topAreaByCompleted,
  uniqueAreasWithCompleted,
  radarChartData,
} from "@/lib/stats-utils";

export type ChartData = {
  area: string;
  completed: number;
};

const chartConfig = {
  desktop: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RadarChartComponent({
  stats,
  days,
}: {
  stats: TStats[];
  days: string;
}) {
  const chartData = radarChartData(stats);

  return (
    <Card className="border-zinc-800 bg-black/95">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-zinc-200">
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 p-6 md:grid-cols-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[350px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarGrid stroke="hsl(var(--muted-foreground)/0.2)" />
            <Radar
              dataKey="completed"
              fill="var(--color-desktop)"
              fillOpacity={0.7}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "hsl(var(--primary))",
                strokeWidth: 0,
              }}
            />
          </RadarChart>
        </ChartContainer>
        <TaskStatsRC stats={stats} days={days} />
      </CardContent>
    </Card>
  );
}

export function TaskStatsRC({
  stats,
  days,
}: {
  stats: TStats[];
  days: string;
}) {
  const achievedPercentage = calculateAchievedPercentage(stats);
  const { total, completed } = calculateTotalCompletion(stats);
  const completionPerDay = completed / parseInt(days, 10);
  const topArea = topAreaByCompleted(stats);
  const doneAreas = uniqueAreasWithCompleted(stats);

  return (
    <div className="space-y-4 text-sm">
      <StatItem label="Achieved" value={`${achievedPercentage}%`} />
      <StatItem label="Total Tasks" value={total.toString()} />
      <StatItem label="Completed" value={completed.toString()} />
      <StatItem
        label="Completion Rate"
        value={`${((completed / total) * 100).toFixed(2)}%`}
      />
      <StatItem
        label="Daily Completion"
        value={`${completionPerDay.toFixed(2)}`}
      />
      <StatItem label="Active Areas" value={doneAreas.toString()} />
      <StatItem
        label="Top Area"
        value={topArea.topArea ?? "Not Completed"}
        subtitle={
          topArea.maxCompleted ? `(${topArea.maxCompleted})` : undefined
        }
      />
    </div>
  );
}

function StatItem({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 py-2">
      <span className="font-medium text-zinc-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-zinc-200">{value}</span>
        {subtitle && <span className="text-xs text-zinc-500">{subtitle}</span>}
      </div>
    </div>
  );
}
