import AreaHeader from "@/components/areas-comps/area/area-header";
import DailyNote from "@/components/areas-comps/area/daily-note";
import { currentUser, fetchAreaById } from "@/lib/db/stats";
import { TArea } from "@/lib/types";

export default async function AreaNotePage({
  params,
}: {
  params: { areaId: string };
}) {
  const { areaId } = params;
  const { area, note }: TArea = await fetchAreaById(areaId);
  const user = await currentUser();
  return (
    <div className="size-full p-4 pt-0 sm:w-3/4">
      <AreaHeader
        areaId={areaId}
        area={area}
        user={JSON.parse(JSON.stringify(user))}
      />
      <div className="bbn box-border rounded-lg px-4 py-2">
        <DailyNote areaId={areaId as string} note={note as string} />
      </div>
    </div>
  );
}
