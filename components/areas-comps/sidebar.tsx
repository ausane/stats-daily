"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TSC, SetState, SidebarContentProps } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { insertAllAreas } from "@/features/area-slice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Menu, SquarePen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Sidebar({ data }: { data: TSC[] }) {
  const dispatch = useAppDispatch();
  const areas = useAppSelector((state) => state.area.areas);

  const [isSidebarOpen, setSidebarState] = useState(false);

  useEffect(() => {
    dispatch(insertAllAreas(data));
  }, [data, dispatch]);

  const toggleSidebar = () => setSidebarState((prev) => !prev);

  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarState}>
        <SheetTrigger
          className={`flex-center bbn fixed left-4 top-4 z-50 h-10 w-10 rounded-md bg-background hover:bg-accent hover:text-accent-foreground max-md:flex md:hidden ${isSidebarOpen && "hidden"}`}
          onClick={toggleSidebar}
          aria-labelledby="open-sidebar-btn"
        >
          <Menu size={20} />
          <span id="open-sidebar-btn" className="hidden">
            Open Sidebar
          </span>
        </SheetTrigger>
        <SheetContent side="left" className="w-2/3 max-sm:w-4/5">
          <SheetHeader>
            <SheetTitle className="my-8">
              <CreateAreaLink setSidebarState={setSidebarState} />
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <SidebarContent areas={areas} setSidebarState={setSidebarState} />
        </SheetContent>
      </Sheet>

      <div className="box-border h-full w-1/4 overflow-auto border-r px-2 max-lg:w-2/5 max-md:hidden">
        <div className="flex-start sticky top-4 mb-4 box-border w-full bg-background">
          <CreateAreaLink setSidebarState={setSidebarState} />
        </div>
        <SidebarContent areas={areas} />
      </div>
    </>
  );
}

export function SidebarContent(props: SidebarContentProps) {
  const { areas, setSidebarState } = props;

  const { areaId } = useParams();
  const router = useRouter();

  const handleAreaNavigation = (areaId: string) => {
    if (setSidebarState) setSidebarState(false);
    router.push(`/areas/${areaId}`);
    router.refresh();
  };

  return (
    <>
      <div className="sticky top-20 h-[calc(100%-6rem)] w-full overflow-auto px-2">
        {areas?.map((item, index) => (
          <div
            key={index}
            className={`flex-start my-2 box-border w-[calc(100%-2px)] rounded-md hover:bg-secondary ${item.areaId === areaId ? "bg-secondary" : "bg-background"}`}
          >
            <button
              onClick={() => handleAreaNavigation(item.areaId)}
              className="flex-start box-border w-full gap-4"
            >
              <span className="flex-center bbn h-10 w-10 rounded-md">
                {index + 1}
              </span>
              <p className="flex-start w-[calc(100%-4rem)] truncate">
                {item.areaName}
              </p>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export function CreateAreaLink({
  setSidebarState,
}: {
  setSidebarState: SetState<boolean>;
}) {
  return (
    <Link
      className="flex-between mx-2 h-10 w-full rounded-lg pr-4 opacity-80 transition-transform duration-200 hover:bg-accent hover:text-accent-foreground active:scale-95"
      onClick={() => setSidebarState(false)}
      href={`/areas/create`}
    >
      <h2 className="flex-start gap-4 text-lg">
        <code className="bbn flex-center bold h-10 w-10 rounded-md text-2xl">
          SD
        </code>
        <span>StatsDaily</span>
      </h2>
      <SquarePen size={20} aria-hidden="true" />
      <span className="sr-only">Create new area</span>
    </Link>
  );
}
