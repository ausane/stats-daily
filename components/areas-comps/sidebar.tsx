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
  const areas = useAppSelector((state) => state.area.areas);

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
        className={`fixed left-4 top-4 z-10 h-10 w-10 max-md:flex md:hidden ${
          isSidebarOpen && "hidden"
        }`}
        onClick={toggleSidebar}
      >
        <Menu size={20} />
        <span className="sr-only">Open Sidebar</span>
      </IconButton>

      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } hidden max-md:block`}
        onClick={toggleSidebar}
      >
        <div
          className="h-full w-80 max-w-sm transform bg-background px-2 py-4 shadow-lg transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-end sticky top-0 mb-2 box-border h-8 w-full bg-background">
            <IconButton onClick={toggleSidebar}>
              <X size={15} />
              <span className="sr-only">Close Sidebar</span>
            </IconButton>
          </div>
          <SidebarContent
            areas={areas}
            areaId={id}
            toggleSidebar={toggleSidebar}
          />
        </div>
      </div>

      <div className="bbn box-border h-full w-1/4 overflow-auto px-2 max-lg:w-2/5 max-md:hidden">
        <SidebarContent areas={areas} areaId={id} />
      </div>
    </>
  );
}

export function SidebarContent({
  areaId,
  areas,
  toggleSidebar,
}: {
  areaId: string;
  areas: TSC[];
  toggleSidebar?: () => void;
}) {
  return (
    <>
      <div className="flex-start sticky top-4 mb-4 box-border w-full bg-background">
        <Link
          className="flex-between h-10 w-full rounded-lg px-4 opacity-80 transition-transform duration-200 hover:bg-accent hover:text-accent-foreground active:scale-95"
          onClick={toggleSidebar}
          href={`/areas/create`}
        >
          <h2 className="text-lg">StatsDaily</h2>
          <SquarePen size={20} />
          <span className="sr-only">Create new area</span>
        </Link>
      </div>
      <div className="sticky top-20 h-[calc(100%-6rem)] w-full overflow-auto px-2">
        {areas?.map((item, index) => (
          <div
            key={index}
            className={`flex-start my-2 box-border w-[calc(100%-2px)] rounded-md hover:bg-secondary ${item.areaId === areaId ? "bg-secondary" : "bg-background"}`}
          >
            <Link
              onClick={toggleSidebar}
              href={`/areas/${item.areaId}`}
              className="flex-start box-border w-full gap-4"
            >
              <span className="flex-center bbn h-9 w-9 rounded-md">
                {index + 1}
              </span>
              <p className="w-[calc(100%-4rem)] truncate">{item.areaName}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
