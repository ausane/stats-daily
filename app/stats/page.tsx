import { ChartCollection } from "@/components/charts/collection";
import { statsdaily, cleanTask } from "@/lib/db/daily-stats";
import { TStats } from "@/lib/types";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";

export default async function StatsPage() {
  const user = await stackServerApp.getUser();
  if (!user) return redirect("/sign-in");

  const stats: TStats[] = await statsdaily(user?.id as string, 60);

  // cleanTask();

  const d1 = JSON.stringify(stats);
  const d2: TStats[] = JSON.parse(d1);

  return <ChartCollection data={d2} />;
}
