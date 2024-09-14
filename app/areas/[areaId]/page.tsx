import { Metadata } from "next";
import ShowTasks from "@/components/areas-comps/area/show-tasks";
import CreateArea from "@/components/areas-comps/create/create-area";
import { currentUser, fetchAreaById, fetchTasks } from "@/lib/db/stats";
import { TArea, TUser } from "@/lib/types";
import InitializeSD from "@/components/areas-comps/create/initialize";

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
  const { _id }: TUser = await currentUser();

  if (areaId === "create") {
    const data = await fetchTasks();
    const userId = _id?.toString() as string;

    return !data?.length ? (
      <InitializeSD userId={userId} />
    ) : (
      <CreateArea userId={userId} />
    );
  }

  return <ShowTasks areaId={areaId} />;
}
