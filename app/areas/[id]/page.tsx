import ShowTasks from "@/components/areas-comps/area/task-stats";
import CreateArea from "@/components/areas-comps/create/create-area";

export default async function TaskStats({ params }: { params: { id: string } }) {
    const id = params.id;
    return id === "create" ? <CreateArea /> : <ShowTasks id={id} />;
}
