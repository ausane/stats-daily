import React from "react";
import { Note } from "@/models/note.model";
import EditorPage from "@/components/text-editor";
import connectToDatabase from "@/lib/db/mongodb";
import { format, isValid, startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, PlusIcon } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@/lib/db/stats";

export default async function NotesPage({
  params,
}: {
  params: { date: string };
}) {
  await connectToDatabase();
  const user = await currentUser();

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
        title={todayNote?.title || ""}
        content={todayNote?.content || ""}
      />
    );
  }

  // Parse and validate the date
  const parsedDate = new Date(date);

  if (!isValid(parsedDate)) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Invalid Date</h2>
          <p className="mt-2 text-gray-600">Please select a valid date</p>
          <Link href="/notes/today">
            <Button className="mt-4">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const formattedDate = format(parsedDate, "MMMM d, yyyy");
  const isToday =
    format(new Date(), "yyyy-MM-dd") === format(parsedDate, "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="my-6 flex h-10 items-center justify-between">
          <h1 className="text-2xl font-bold">{formattedDate}</h1>
          {isToday && !note && (
            <Link href="/notes/today">
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Note
              </Button>
            </Link>
          )}
          {isToday && note && (
            <Link href="/notes/today">
              <Button variant="outline" size="icon">
                <Pencil className="size-4" />
              </Button>
            </Link>
          )}
        </div>

        {note ? (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <span className="text-sm text-muted-foreground">
                {format(new Date(note.updatedAt), "h:mm a")}
              </span>
            </div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-lg border bg-card">
            <div className="text-center">
              <p className="text-muted-foreground">No note for this date</p>
              {isToday && (
                <Link href="/notes/today">
                  <Button variant="outline" className="mt-4">
                    Create a note
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
