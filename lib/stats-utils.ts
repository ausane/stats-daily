import { ChartData } from "@/components/charts/radar-chart";
import { TStats } from "./types";

export const calculateTotalCompletion = (stats: TStats[]) => {
  if (!stats.length) return { total: 0, completed: 0 };

  const taskSummaries = stats.map((stat) => {
    // const formattedDate =
    //   stat.createdAt?.toISOString().split("T")[0] || "2024-08-21";

    const [totalTasks, completedTasks] = stat.taskStats.reduce(
      (totals, task) => [totals[0] + task.total, totals[1] + task.completed],
      [0, 0],
    );

    return {
      // date: formattedDate,
      total: totalTasks,
      completed: completedTasks,
    };
  });

  const total = taskSummaries.reduce((sum, i) => sum + i.total, 0);
  const completed = taskSummaries.reduce((sum, i) => sum + i.completed, 0);

  return { total, completed };
};

// Calculate achieved percentage
export const calculateAchievedPercentage = (stats: TStats[]) => {
  if (!stats.length) return 0;

  const totalAchieved = stats.reduce((sum, item) => {
    const l = item.taskStats.length;
    const t = item.taskStats.reduce((s, i) => s + i.achieved, 0) / l;
    return sum + t;
  }, 0);

  return (totalAchieved / stats.length).toFixed(2);
};

// Calculate average stats by area
export const calculateAvgStats = (stats: TStats[]) => {
  const taskStats = stats.flatMap((item) =>
    item.taskStats.map((taskItem) => ({
      area: taskItem.area,
      completed: taskItem.completed,
    })),
  );

  const uniqueStats = taskStats.filter(
    (item, index, self) =>
      index === self.findIndex((s) => s.area === item.area),
  );

  const aggregatedStats = uniqueStats.map((uniqueItem) => {
    const totalTasks = taskStats
      .filter((task) => task.area === uniqueItem.area)
      .reduce((sum, task) => sum + task.completed, 0);

    return {
      area: uniqueItem.area,
      completed: totalTasks,
    };
  });

  return aggregatedStats;
};

// Calculate chart data
export const calculatePieChartData = (stats: TStats[]) => {
  if (!stats.length) return [];

  const aggregatedStats = calculateAvgStats(stats);

  const avgStats = aggregatedStats.sort((a, b) => b.completed - a.completed);
  const othersTasks =
    avgStats.length > 4
      ? avgStats.slice(4).reduce((acc, obj) => acc + obj.completed, 0)
      : 0;

  const colors = [
    "--color-chrome",
    "--color-safari",
    "--color-firefox",
    "--color-edge",
  ];

  const chartData = avgStats.slice(0, 4).map((item, index) => ({
    browser: item.area,
    visitors: item.completed,
    fill: `var(${colors[index]})`,
  }));

  chartData.push({
    browser: "others",
    visitors: othersTasks,
    fill: "var(--color-other)",
  });

  return chartData;
};

export const isTasksCompleted = (stats: TStats[]) => {
  return stats.some((item) => item.taskStats.some((task) => task.completed));
};

export const radarChartData = (stats: TStats[]) => {
  const data: ChartData[] = calculateAvgStats(stats);
  return data.sort((a, b) => b.completed - a.completed).slice(0, 6);
};

export const topAreaByCompleted = (stats: TStats[]) => {
  const areaCompletedCounts = stats
    .flatMap((entry) => entry.taskStats) // Combine all taskStats arrays
    .reduce(
      (acc, task) => {
        acc[task.area] = (acc[task.area] || 0) + task.completed; // Sum completed tasks per area
        return acc;
      },
      {} as Record<string, number>,
    );

  // Find the area with the highest completed tasks
  let topArea = null;
  let maxCompleted = 0;

  for (const [area, completed] of Object.entries(areaCompletedCounts)) {
    if (completed > maxCompleted) {
      maxCompleted = completed;
      topArea = area;
    }
  }

  return { topArea, maxCompleted };
};

export const uniqueAreasWithCompleted = (stats: TStats[]) => {
  const allAreas = stats
    .flatMap((entry) => entry.taskStats)
    .filter((task) => task.completed > 0)
    .map((task) => task.area);

  return new Set(allAreas).size;
};
