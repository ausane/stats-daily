import { Metadata } from "next";
import ShowTasks from "@/components/areas-comps/area/show-tasks";
import CreateArea from "@/components/areas-comps/create/create-area";
import { fetchAreaById, fetchTasks } from "@/lib/db/stats";
import { TArea } from "@/lib/types";
import InitializeSD from "@/components/areas-comps/create/initialize";
// import { stackServerApp } from "@/stack";

export type AreasPageProps = { params: { areaId: string } };

export const generateMetadata = async ({
  params,
}: AreasPageProps): Promise<Metadata> => {
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

export default async function AreasPage(props: AreasPageProps) {
  const { areaId } = props.params;
  // const user = await stackServerApp.getUser();

  const user = {
    id: "user_id21",
  };

  // if (user) {
  if (areaId === "create") {
    const data = await fetchTasks();
    return !data?.length ? (
      <InitializeSD userId={user.id} />
    ) : (
      <CreateArea userId={user.id} />
    );
  }

  return <ShowTasks areaId={areaId} />;
  // }
}
