import { Metadata } from "next";
import ShowTasks from "@/components/areas-comps/area/show-tasks";
import CreateArea from "@/components/areas-comps/create/create-area";
import { auth } from "@clerk/nextjs/server";

export type TaskStatsProps = { params: { areaId: string } };

export const generateMetadata = ({ params }: TaskStatsProps): Metadata => {
  return {
    title: params.areaId,
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
