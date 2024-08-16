"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TSC } from "@/lib/types";
import { usePathname } from "next/navigation";
import { insertAllAreas } from "@/features/area-slice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Menu, X, SquarePen } from "lucide-react";
import IconButton from "../ui/icon-button";

export default function Sidebar({ data }: { data: TSC[] | void }) {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.area.areas);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const currentPath = usePathname();
    const segments = currentPath.split("/"); // Split path by '/'
    const id = segments[segments.length - 1]; // Get the last segment

    useEffect(() => {
        dispatch(insertAllAreas(data));
    }, [data, dispatch]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <IconButton
                className={`w-10 h-10 max-md:flex md:hidden fixed top-4 left-4 z-10 ${
                    isSidebarOpen && "hidden"
                }`}
                onClick={toggleSidebar}
            >
                <Menu size={20} />
            </IconButton>

            <div
                className={`fixed inset-0 z-40 transition-transform duration-300 bg-black bg-opacity-50 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } max-md:block hidden`}
                onClick={toggleSidebar}
            >
                <div
                    className="w-80 max-w-sm h-full bg-background px-2 py-4 transition-transform duration-300 transform shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full h-10 flex-end mb-2 box-border sticky top-0 bg-background">
                        <IconButton
                            className="w-10 h-10"
                            onClick={toggleSidebar}
                        >
                            <X size={20} />
                        </IconButton>
                    </div>
                    <SidebarContent
                        tasks={tasks}
                        areaId={id}
                        toggleSidebar={toggleSidebar}
                    />
                </div>
            </div>

            <div className="w-1/4 h-full bbn box-border overflow-auto px-2 max-md:hidden max-lg:w-2/5">
                <SidebarContent tasks={tasks} areaId={id} />
            </div>
        </>
    );
}

export function SidebarContent({
    areaId,
    tasks,
    toggleSidebar,
}: {
    areaId: string;
    tasks: TSC[];
    toggleSidebar?: () => void;
}) {
    return (
        <>
            <div className="w-full flex-start box-border sticky top-4 bg-background">
                <Link
                    className="flex-between w-full h-10 opacity-80 hover:bg-accent hover:text-accent-foreground px-4 rounded-lg active:scale-95 transition-transform duration-200"
                    onClick={toggleSidebar}
                    href={`/areas/create`}
                >
                    <h2 className="text-lg">StatsDaily</h2>
                    <SquarePen size={20} />
                </Link>
            </div>
            <div className="overflow-auto w-full h-[calc(100%-6rem)] sticky top-20 px-2">
                {tasks?.map((task, index) => (
                    <div
                        key={index}
                        className={`w-[calc(100%-2px)] my-2 flex-start box-border rounded-md hover:bg-secondary
                                    ${
                                        task._id === areaId
                                            ? "bg-secondary"
                                            : "bg-background"
                                    }`}
                    >
                        <Link
                            onClick={toggleSidebar}
                            href={`/areas/${task._id}`}
                            className="w-full flex-start gap-4 box-border"
                        >
                            <span className="h-9 w-9 flex-center bbn rounded-md">
                                {index + 1}
                            </span>
                            <p className="w-[calc(100%-4rem)] truncate">
                                {task.area}
                            </p>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}
