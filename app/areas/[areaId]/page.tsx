import { Metadata } from "next";
import ShowTasks from "@/components/areas-comps/area/show-tasks";
import CreateArea from "@/components/areas-comps/create/create-area";
import { auth } from "@clerk/nextjs/server";
import { fetchAreaById } from "@/lib/db/stats";
import { TArea } from "@/lib/types";

export type TaskStatsProps = { params: { areaId: string } };

export const generateMetadata = async ({
  params,
}: TaskStatsProps): Promise<Metadata> => {
  const { areaId } = params;
  const isCreateArea = areaId === "create";
  const areaItem: TArea = isCreateArea || (await fetchAreaById(areaId));
  const title = isCreateArea
    ? "Create Area"
    : areaItem?.area || "Area Not Found";

  return {
    title: title,
  };
};

export default async function TaskStats(props: TaskStatsProps) {
  const { areaId } = props.params;
  const { userId } = auth();

  if (areaId === "create" && userId) {
    return <CreateArea userId={userId} />;
  } else {
    return <ShowTasks areaId={areaId} />;
  }
}
