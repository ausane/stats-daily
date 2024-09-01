"use client";

import { SetState, TStats } from "@/lib/types";
import { useEffect, useState } from "react";

import { PieChartComponent } from "@/components/charts/pie-chart";
import { LineChartComponent } from "@/components/charts/line-chart";
import { RadialChartComponent } from "@/components/charts/radial-chart";
import { Component } from "@/components/charts/bar-multiple";
import { AreaChartComponent } from "@/components/charts/area-chart";
import Link from "next/link";
import { CheckIcon } from "@/components/landing-page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

export function ChartCollection({ data }: { data: TStats[] }) {
  const [selectedValue, setSelectedValue] = useState("60");
  const [stats, setStats] = useState(data);

  useEffect(() => {
    const count = parseInt(selectedValue);
    setStats(data.slice(0, count));
  }, [selectedValue, data]);

  const chartData = calculateAvgStats(stats);
  const barChartData = generateLineChartData(stats).reverse();

  // Calculate degree for a gauge or radial chart
  const achievedPercentage = calculateAchievedPercentage(stats);
  const degree = Math.floor((achievedPercentage / 100) * 360);

  return (
    <>
      <header className="flex-between sticky top-0 z-40 h-14 border-b bg-background px-4 lg:px-6">
        <Link href="/" className="flex-center gap-4" prefetch={false}>
          <CheckIcon />
          <span className="text-2xl font-bold text-muted-foreground">
            StatsDaily
          </span>
          <span className="sr-only">
            statsDaily - Daily Tasks Completion Tracker
          </span>
        </Link>
        <SelectTimeline
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
      </header>
      <div className="flex w-full max-sm:flex-col">
        <PieChartComponent chartData={chartData} />
        <RadialChartComponent total={achievedPercentage} degree={degree} />
      </div>
      {/* <div className="flex w-full max-sm:flex-col">
        <Component />
        <AreaChartComponent />
      </div> */}

      <LineChartComponent LCCD={barChartData} />
    </>
  );
}

export function SelectTimeline({
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: string;
  setSelectedValue: SetState<string>;
}) {
  return (
    <div>
      <Select
        value={selectedValue}
        onValueChange={setSelectedValue}
        name="select-timeline"
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Last 2 months" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Timeline</SelectLabel>
            <SelectItem value="60">Last 2 months</SelectItem>
            <SelectItem value="30">Last month</SelectItem>
            <SelectItem value="21">Last 21 days</SelectItem>
            <SelectItem value="15">Last 15 days</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="2">Last 2 days</SelectItem>
            <SelectItem value="1">Yesterday</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

// Generate bar chart data
const generateLineChartData = (stats: TStats[]) => {
  if (!stats) return [];

  return stats.map((item) => {
    const formattedDate =
      item.createdAt?.toString().split("T")[0] || "2024-08-21";

    const [total, completed] = item.taskStats.reduce(
      (acc, task) => [acc[0] + task.total, acc[1] + task.completed],
      [0, 0],
    );

    return {
      date: formattedDate,
      desktop: completed,
      mobile: total,
    };
  });
};

// Calculate achieved percentage
const calculateAchievedPercentage = (stats: TStats[]) => {
  if (!stats) return 0;

  const totalAchieved = stats.reduce((sum, item) => {
    const l = item.taskStats.length;
    const t = item.taskStats.reduce((s, i) => s + i.achieved, 0) / l;
    return sum + t;
  }, 0);

  return Math.floor(totalAchieved / stats.length);
};

// Calculate average stats by area
const calculateAvgStats = (stats: TStats[]) => {
  if (!stats) return [];

  const taskStats = stats.flatMap((item) =>
    item.taskStats.map((taskItem) => ({
      area: taskItem.area,
      tasks: taskItem.completed,
    })),
  );

  const uniqueStats = taskStats.filter(
    (item, index, self) =>
      index === self.findIndex((s) => s.area === item.area),
  );

  const aggregatedStats = uniqueStats.map((uniqueItem) => {
    const totalTasks = taskStats
      .filter((task) => task.area === uniqueItem.area)
      .reduce((sum, task) => sum + task.tasks, 0);

    return {
      area: uniqueItem.area,
      tasks: totalTasks,
    };
  });

  // Calculate chart data
  const avgStats = aggregatedStats.sort((a, b) => b.tasks - a.tasks);
  const othersTasks =
    avgStats.length > 4
      ? avgStats.slice(4).reduce((acc, obj) => acc + obj.tasks, 0)
      : 0;

  const colors = [
    "--color-chrome",
    "--color-safari",
    "--color-firefox",
    "--color-edge",
  ];

  const chartData = avgStats.slice(0, 4).map((item, index) => ({
    browser: item.area,
    visitors: item.tasks,
    fill: `var(${colors[index]})`,
  }));

  chartData.push({
    browser: "others",
    visitors: othersTasks,
    fill: "var(--color-other)",
  });

  return chartData;
};
