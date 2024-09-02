import { ChartCollection } from "@/components/charts/collection";

import { auth } from "@clerk/nextjs/server";
import { statsdaily, cleanTask } from "@/lib/db/daily-stats";
import { TStats } from "@/lib/types";

export default async function StatsPage() {
  const { userId } = auth();
  const stats: TStats[] = await statsdaily(userId as string, 60);

  // cleanTask(userId as string);

  const d1 = JSON.stringify(stats);
  const d2: TStats[] = JSON.parse(d1);

  // console.log(d2);
  return (
    <>
      <ChartCollection data={d2} />
    </>
  );
}
