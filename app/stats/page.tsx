import { ChartCollection } from "@/components/charts/collection";
import { statsdaily, cleanTask } from "@/lib/db/daily-stats";
import { auth } from "@clerk/nextjs/server";
import { TStats } from "@/lib/types";

export default async function StatsPage() {
  const { userId } = auth();
  const stats: TStats[] = await statsdaily(userId as string, 60);

  // cleanTask();

  const d1 = JSON.stringify(stats);
  const d2: TStats[] = JSON.parse(d1);

  return (
    <>
      <ChartCollection data={d2} />
    </>
  );
}
