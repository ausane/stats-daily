import type { Metadata } from "next";
import { Suspense } from "react";
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
        <div className="w-full h-screen flex">
            <div className="w-1/4 h-full bbn box-border overflow-auto">
                <Suspense fallback={<p>Loading feed...</p>}>
                    <Sidebar data={stats} />
                </Suspense>
            </div>
            <div className="w-3/4 h-full bbn box-border overflow-auto">
                {children}
            </div>
        </div>
    );
}
