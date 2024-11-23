import AreaHeader from "@/components/areas-comps/area/area-header";
import DailyNote from "@/components/areas-comps/area/daily-note";
import { currentUser, fetchAreaById } from "@/lib/db/stats";
import { TArea } from "@/lib/types";
import { ps } from "@/lib/utils";

export default async function AreaNotePage({
  params,
}: {
  params: { areaId: string };
}) {
  const { areaId } = params;
  const areaItem = await fetchAreaById(areaId);
  const { area, note } = areaItem as TArea;
  const user = await currentUser();
  return (
    <div className="size-full overflow-hidden p-4 pt-0 md:w-3/4">
      <AreaHeader areaId={areaId} area={area as string} user={ps(user)} />
      <div className="bbn box-border flex flex-col gap-4 rounded-lg p-4">
        <DailyNote areaId={areaId as string} note={note as string} />
      </div>
    </div>
  );
}
