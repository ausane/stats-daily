import { ChartCollection } from "@/components/charts/collection";

import { auth } from "@clerk/nextjs/server";
import { statsdaily } from "@/lib/db/daily-stats";
import { TStats } from "@/lib/types";

export default async function StatsPage() {
  const { userId } = auth();
  const stats: TStats[] = await statsdaily(userId as string, 60);

  const d1 = JSON.stringify(stats);
  const d2: TStats[] = JSON.parse(d1);

  // console.log(d2);
  return (
    <>
      <ChartCollection data={d2} />
    </>
  );
}
