import { ChartCollection } from "@/components/charts/chart-collection";
import { statsdaily } from "@/lib/db/daily-stats";
import { TStats, TUser } from "@/lib/types";
import { currentUser } from "@/lib/db/stats";

export default async function StatsPage() {
  const { _id: userId }: TUser = await currentUser();

  const stats: TStats[] = await statsdaily(userId?.toString() as string, 60);

  const d1 = JSON.stringify(stats);
  const d2: TStats[] = JSON.parse(d1);

  return <ChartCollection data={d2} />;
}
