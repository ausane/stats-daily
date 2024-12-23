import React from "react";
import { Note } from "@/models/note.model";
import EditorPage from "@/components/text-editor";
import connectToDatabase from "@/lib/db/mongodb";
import { format, isValid, startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, PlusIcon } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@/lib/db/stats";
import { ps } from "@/lib/utils";
import { DailyNote, InValidDate } from "@/components/daily-note";

export default async function NotesPage({
  params,
}: {
  params: { date: string };
}) {
  await connectToDatabase();
  const user = await currentUser();

  // await Note.deleteMany({});

  const { date } = params;

  // Handle "today" route with proper user check
  if (date === "today") {
    const parsedDate = new Date();
    const dayStart = startOfDay(parsedDate);
    const dayEnd = endOfDay(parsedDate);

    const todayNote = await Note.findOne({
      userId: user._id.toString(),
      createdAt: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    });

    return (
      <EditorPage
        noteId={todayNote?._id?.toString() || null}
        content={todayNote?.content || ""}
      />
    );
  }

  // Parse and validate the date
  const parsedDate = new Date(date);

  if (!isValid(parsedDate)) return <InValidDate />;

  // Query note for the specific day with user check
  const dayStart = startOfDay(parsedDate);
  const dayEnd = endOfDay(parsedDate);

  const note = await Note.findOne({
    userId: user._id,
    createdAt: {
      $gte: dayStart,
      $lte: dayEnd,
    },
  });

  return <DailyNote parsedDate={parsedDate} note={ps(note)} />;
}
