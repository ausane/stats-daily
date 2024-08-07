import ShowTasks from "@/components/areas-comps/area/show-tasks";
import CreateArea from "@/components/areas-comps/create/create-area";

export default async function TaskStats({
    params,
}: {
    params: { id: string };
}) {
    const id = params.id;
    return id === "create" ? <CreateArea /> : <ShowTasks id={id} />;
}
