import type { Metadata } from "next";
import { fetchAreas } from "@/lib/db/stats";
import Sidebar from "@/components/areas-comps/sidebar";
import { TSC } from "@/lib/types";

export const metadata: Metadata = {
  title: {
    default: "StatsDaily Area",
    template: "%s — StatsDaily",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data: TSC[] | undefined = await fetchAreas();
  return (
    <div className="flex h-screen w-screen">
      <Sidebar data={data as TSC[]} />
      {children}
    </div>
  );
}
