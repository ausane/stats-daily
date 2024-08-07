"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TSC, SidebarTogglerProps } from "@/lib/types";
import { usePathname } from "next/navigation";
import { insertAllAreas } from "@/features/areaSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { ModeToggle } from "../theme-provider";
import { Menu, X } from "lucide-react";
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
                    className="w-2/4 max-sm:w-3/4 max-w-sm h-full bg-background px-2 py-4 transition-transform duration-300 transform shadow-lg"
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
            <div className="w-full h-10 flex-between p-2 bbn box-border sticky top-4 bg-background">
                <h2 className="font-bold py-1">StatsDaily</h2>
                <Link onClick={toggleSidebar} href={`/areas/create`}>
                    N
                </Link>
            </div>
            <div className="overflow-auto w-full h-[calc(100%-4rem)] sticky top-14">
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
                            onClick={toggleSidebar}
                            href={`/areas/${task._id}`}
                            className="w-4/5 h-full flex-start p-2 bbn box-border truncate"
                        >
                            <span className="w-full truncate">{task.area}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}
