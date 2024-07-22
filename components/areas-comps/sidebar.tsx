"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { TSC, AreaRef } from "@/lib/types";
import { usePathname } from "next/navigation";
import { insertAllAreas } from "@/features/areaSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";

export default function Sidebar({ data }: { data: TSC[] | void }) {
    const areaRef = useRef<(AreaRef | null)[]>([]);

    const tasks = useAppSelector((state) => state.area.areas);

    const currentPath = usePathname();
    const segments = currentPath.split("/"); // Split path by '/'
    const id = segments[segments.length - 1]; // Get the last segment

    useEffect(() => {
        areaRef.current.forEach((item) => {
            if (item?.el) {
                item.el.style.backgroundColor = item._id === id ? "green" : "";
            }
        });
    });

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(insertAllAreas(data));
    }, [dispatch, data]);

    return (
        <div className="w-full h-full bbn box-border">
            <div className="w-full h-8 flex-start p-2 bbn box-border">toolbar</div>
            <div className="flex-between bbn px-2">
                <h2 className="font-bold py-1">StatsDaily</h2>
                <Link href={`/areas/create`}>N</Link>
            </div>
            {tasks?.map((task, index) => (
                <div
                    ref={(el) => {
                        areaRef.current[index] = { el, _id: task._id };
                    }}
                    key={index}
                    className="w-full h-8 bbn my-2 flex-center justify-between box-border hover:bg-green-700"
                >
                    <span className="h-full w-1/5 bbn flex-center box-border">{index}</span>
                    <Link
                        href={`/areas/${task._id}`}
                        className="w-4/5 h-full flex-start p-2 bbn box-border truncate"
                    >
                        <span className="w-full truncate">{task.area}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
}
