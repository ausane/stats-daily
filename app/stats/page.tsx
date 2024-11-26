import { StatsComponent } from "@/components/charts/stats-component";
import { statsdaily } from "@/lib/daily-stats";
import { TStats } from "@/lib/types";
import { ps } from "@/lib/utils";

export default async function StatsPage() {
  const stats: TStats[] = await statsdaily(60);

  return <StatsComponent data={ps(stats)} />;
}
