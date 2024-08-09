import { TStat } from "@/lib/types";
import { fetchAreaById } from "@/lib/stats";
import TaskList from "../task-list";
import AreaHeader from "./area-header";

export default async function ShowTasks({ id }: { id: string }) {
    type TSearchedData = TStat | void | null | undefined;
    const searchedData: TSearchedData = await fetchAreaById(id);
    const serializableData: TStat =
        searchedData && JSON.parse(JSON.stringify(searchedData));

    if (serializableData) {
        const { _id, area } = serializableData;

        return (
            <div className="main-content bbn overflow-auto max-md:w-full flex flex-col gap-4 p-4 pt-0">
                <AreaHeader _id={_id as string} area={area} />
                <TaskList data={serializableData} />
            </div>
        );
    } else {
        return (
            <div className="main-content flex-center">
                <h2 className="font-bold text-lg">404 | Page Not Found</h2>
            </div>
        );
    }
}
