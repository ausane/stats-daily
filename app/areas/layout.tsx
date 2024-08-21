import type { Metadata } from "next";
import { fetchAreas } from "@/lib/db/stats";
import Sidebar from "@/components/areas-comps/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "your tasks",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar data={await fetchAreas()} />
      {children}
    </div>
  );
}
