import { DailyNotes } from "@/components/daily-note";
import { getDailyNotes } from "@/lib/daily-note";
import { TNote } from "@/lib/types";
import { ps } from "@/lib/utils";

export default async function NotesPage() {
  const notes = await getDailyNotes();

  return <DailyNotes notes={ps(notes as TNote[])} />;
}
