"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TSC, SidebarTogglerProps } from "@/lib/types";
import { usePathname } from "next/navigation";
import { insertAllAreas } from "@/features/areaSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { ModeToggle } from "../theme-provider";
import { PanelLeft } from "lucide-react";
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
            <div className="w-1/4 h-full bbn box-border overflow-auto px-2 max-md:hidden">
                <div className="w-full h-16 flex-between p-2 bbn box-border sticky top-0 bg-background">
                    <IconButton className="w-10 h-10" onClick={toggleSidebar}>
                        <PanelLeft />
                    </IconButton>
                </div>
                <div className="flex-between bbn px-2 h-8 sticky top-16 bg-background">
                    <h2 className="font-bold py-1">StatsDaily</h2>
                    <Link href={`/areas/create`}>N</Link>
                </div>
                <div className="overflow-auto w-full h-[calc(100%-6rem)]">
                    {tasks?.map((task, index) => (
                        <div
                            key={index}
                            className={`w-full h-8 bbn my-2 flex-center justify-between box-border hover:bg-green-700 
                            ${
                                task._id === id
                                    ? "bg-green-600"
                                    : "bg-transparent"
                            }`}
                        >
                            <span className="h-full w-1/5 bbn flex-center box-border">
                                {index}
                            </span>
                            <Link
                                href={`/areas/${task._id}`}
                                className="w-4/5 h-full flex-start p-2 bbn box-border truncate"
                            >
                                <span className="w-full truncate">
                                    {task.area}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <SidebarToggler
                areaId={id}
                tasks={tasks}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
        </>
    );
}

export function SidebarToggler(props: SidebarTogglerProps) {
    const { areaId, tasks, isSidebarOpen, toggleSidebar } = props;
    return (
        <>
            <IconButton
                className="w-10 h-10 max-md:block md:hidden fixed top-4 left-4 z-50"
                onClick={toggleSidebar}
            >
                <PanelLeft />
            </IconButton>

            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-11/12 h-5/6 bg-white rounded-lg overflow-auto px-2">
                        <div className="w-full h-16 flex-between p-2 bbn box-border sticky top-0 bg-background">
                            <IconButton
                                className="w-10 h-10"
                                onClick={toggleSidebar}
                            >
                                <PanelLeft />
                            </IconButton>
                        </div>
                        <div className="flex-between bbn px-2 h-8 sticky top-16 bg-background">
                            <h2 className="font-bold py-1">StatsDaily</h2>
                            <Link href={`/areas/create`}>N</Link>
                        </div>
                        <div className="overflow-auto w-full h-[calc(100%-6rem)]">
                            {tasks?.map((task, index) => (
                                <div
                                    key={index}
                                    className={`w-full h-8 bbn my-2 flex-center justify-between box-border hover:bg-green-700 
                                        ${
                                            task._id === areaId
                                                ? "bg-green-600"
                                                : "bg-transparent"
                                        }`}
                                >
                                    <span className="h-full w-1/5 bbn flex-center box-border">
                                        {index}
                                    </span>
                                    <Link
                                        href={`/areas/${task._id}`}
                                        className="w-4/5 h-full flex-start p-2 bbn box-border truncate"
                                    >
                                        <span className="w-full truncate">
                                            {task.area}
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
