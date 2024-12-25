import { StatsComponent } from "@/components/charts/stats-component";
import { statsdaily } from "@/lib/daily-stats";
import { TStats } from "@/lib/types";
import { ps } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stats",
  description: "Your all-over compiled stats of your daily task completions.",
};

export default async function StatsPage() {
  const stats: TStats[] = await statsdaily(60);

  return <StatsComponent data={ps(stats)} />;
}
