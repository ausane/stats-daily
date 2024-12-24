import EditorComponent from "@/components/text-editor";
import { isValid } from "date-fns";
import { ps } from "@/lib/utils";
import { DailyNote, InValidDate } from "@/components/daily-note";
import { getDailyNote } from "@/lib/daily-note";
import { TNote } from "@/lib/types";

export default async function DailyNotePage({
  params,
}: {
  params: { date: string };
}) {
  const { date } = params;

  // Handle "today" route with proper user check
  if (date === "today") {
    const parsedDate = new Date();
    const todayNote = await getDailyNote(parsedDate);

    return (
      <EditorComponent
        noteId={todayNote?._id?.toString() || null}
        content={todayNote?.content || ""}
      />
    );
  }

  // Parse and validate the date
  const parsedDate = new Date(date);
  if (!isValid(parsedDate)) return <InValidDate />;

  const note = await getDailyNote(parsedDate);

  return <DailyNote parsedDate={parsedDate} note={ps(note as TNote)} />;
}
