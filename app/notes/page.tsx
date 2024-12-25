import { DailyNotes } from "@/components/daily-note";
import { getDailyNotes } from "@/lib/daily-note";
import { TNote } from "@/lib/types";
import { ps } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "Your daily notes.",
};

export default async function NotesPage() {
  const notes = await getDailyNotes();

  return <DailyNotes notes={ps(notes as TNote[])} />;
}
