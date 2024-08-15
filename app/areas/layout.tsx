import type { Metadata } from "next";
import { TSC } from "@/lib/types";
import { fetchAreas } from "@/lib/stats";
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
    const stats: TSC[] | void = await fetchAreas();

    return (
        <div className="w-screen h-screen flex">
            <Sidebar data={stats} />
            {children}
        </div>
    );
}
