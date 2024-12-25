import { fetchAreas } from "@/lib/db/stats";
import Sidebar from "@/components/areas-comps/sidebar";
import { TSC } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data: TSC[] | undefined = await fetchAreas();
  return <Sidebar data={data as TSC[]}>{children}</Sidebar>;
}
