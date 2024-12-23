import { DailyNotes } from "@/components/daily-note";
import connectToDatabase from "@/lib/db/mongodb";
import { TNote } from "@/lib/types";
import { ps } from "@/lib/utils";
import { Note } from "@/models/note.model";

export default async function NotesPage() {
  await connectToDatabase();
  const notes: TNote[] | null = await Note.find({})
    .sort({ createdAt: -1 })
    .limit(10);

  return <DailyNotes notes={ps(notes)} />;
}
