import { Metadata } from "next";
import ShowTasks from "@/components/areas-comps/area/show-tasks";
import CreateArea from "@/components/areas-comps/create/create-area";
import { currentUser, fetchAreaById, fetchTasks } from "@/lib/db/stats";
import { TArea, TUser } from "@/lib/types";
import InitializeSD from "@/components/areas-comps/create/initialize";
import { redirect } from "next/navigation";

export type AreasPageProps = { params: { areaId: string } };

export const generateMetadata = async ({
  params,
}: AreasPageProps): Promise<Metadata> => {
  const { areaId } = params;

  if (areaId === "create") return { title: "Create Area" };

  const areaItem = await fetchAreaById(areaId);
  return { title: areaItem?.area ?? "Area Not Found" };
};

export default async function AreasPage(props: AreasPageProps) {
  const { areaId } = props.params;
  const user: TUser = await currentUser();
  const userId = user?._id?.toString() as string;
  const data = (await fetchTasks()) ?? [];
  const isArea = data?.length > 0;

  if (areaId === "create")
    return <CreateArea userId={userId} isArea={isArea} />;

  if (areaId === "init") {
    return isArea ? (
      redirect("/areas/create")
    ) : (
      <InitializeSD userId={userId} />
    );
  }

  return <ShowTasks areaId={areaId} />;
}
