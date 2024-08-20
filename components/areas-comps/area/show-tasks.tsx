import { TStat } from "@/lib/types";
import { fetchAreaById } from "@/lib/stats";
import TaskList from "../task-list";
import AreaHeader from "./area-header";

export default async function ShowTasks({ areaId }: { areaId: string }) {
  type TSearchedData = TStat | void | null | undefined;
  const searchedData: TSearchedData = await fetchAreaById(areaId);
  const serializableData: TStat =
    searchedData && JSON.parse(JSON.stringify(searchedData));

  if (serializableData) {
    const { _id: areaId, area } = serializableData;

    return (
      <div className="main-content bbn flex flex-col gap-4 overflow-auto p-4 pt-0 max-md:w-full">
        <AreaHeader areaId={areaId as string} area={area} />
        <TaskList data={serializableData} />
      </div>
    );
  } else {
    return (
      <div className="main-content flex-center">
        <h2 className="text-lg font-bold">404 | Page Not Found</h2>
      </div>
    );
  }
}
