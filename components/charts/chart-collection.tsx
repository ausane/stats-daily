"use client";

import { HeaderProps, TStats, MainContentProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { PieChartComponent } from "@/components/charts/pie-chart";
import { LineChartComponent } from "@/components/charts/line-chart";
import { RadialChartComponent } from "@/components/charts/radial-chart";
import { PageFooter, SDIconWithTitle } from "@/components/home-page";
import { InfoIcon } from "lucide-react";
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
  const [selectedValue, setSelectedValue] = useState<string>("1");
  const [stats, setStats] = useState<TStats[]>(data);

  useEffect(() => {
    const count = parseInt(selectedValue, 10);
    setStats(data.slice(0, count));
  }, [selectedValue, data]);

  const tasksCompleted: boolean = isTasksCompleted(stats);
  if (!stats.length || !tasksCompleted) {
    const info = stats.length ? "tnc" : "nsf";
    return (
      <>
        <ChartHeader
          statsLength={false}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
        <NoStatsFound info={info} />
        <PageFooter />
      </>
    );
  }

  const PieChartData = calculatePieChartData(stats);
  const lineChartData = generateLineChartData(stats).reverse();
  const achievedPercentage = calculateAchievedPercentage(stats);
  const degree = Math.floor((achievedPercentage / 100) * 360);

  return (
    <>
      <ChartHeader
        statsLength={true}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
      <ChartMainContent
        PieChartData={PieChartData}
        lineChartData={lineChartData}
        achievedPercentage={achievedPercentage}
        degree={degree}
      />
      <PageFooter />
    </>
  );
}

// Chart Collection Component Header
export function ChartHeader({
  statsLength,
  selectedValue,
  setSelectedValue,
}: HeaderProps) {
  return (
    <header className="flex-between sticky top-0 z-40 h-16 border-b bg-background px-4 lg:px-6">
      <SDIconWithTitle />
      <div className={statsLength ? "block" : "hidden"}>
        <Select
          value={selectedValue}
          onValueChange={setSelectedValue}
          name="select-timeline"
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Timeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Timelines</SelectLabel>
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
    </header>
  );
}

// Chart Collection Component Main Content
export function ChartMainContent({
  PieChartData,
  lineChartData,
  achievedPercentage,
  degree,
}: MainContentProps) {
  return (
    <main>
      <div className="flex w-full max-sm:flex-col">
        <PieChartComponent chartData={PieChartData} />
        <RadialChartComponent total={achievedPercentage} degree={degree} />
      </div>
      <LineChartComponent chartData={lineChartData} />
    </main>
  );
}

export function NoStatsFound({ info }: { info: "tnc" | "nsf" }) {
  const title = info === "tnc" ? "Tasks Not Completed!" : "No Stats Found!";
  const message =
    info === "tnc"
      ? "You haven't completed any tasks yet!"
      : "Please wait at least a day to get started!";

  return (
    <div className="flex-center h-[calc(100dvh-8rem)] flex-col">
      <div className="flex items-center space-x-2">
        <InfoIcon size={24} aria-hidden="true" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <p className="mt-2 text-muted-foreground">{message}</p>
    </div>
  );
}

// Generate bar chart data
const generateLineChartData = (stats: TStats[]) => {
  if (!stats.length) return [];

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
  if (!stats.length) return 0;

  const totalAchieved = stats.reduce((sum, item) => {
    const l = item.taskStats.length;
    const t = item.taskStats.reduce((s, i) => s + i.achieved, 0) / l;
    return sum + t;
  }, 0);

  return Math.floor(totalAchieved / stats.length);
};

// Calculate average stats by area
const calculateAvgStats = (stats: TStats[]) => {
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

  return aggregatedStats;
};

// Calculate chart data
export function calculatePieChartData(stats: TStats[]) {
  if (!stats.length) return [];

  const aggregatedStats = calculateAvgStats(stats);

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
}

export function isTasksCompleted(stats: TStats[]): boolean {
  return stats.some((item) => item.taskStats.some((task) => task.completed));
}
