import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, PlusIcon } from "lucide-react";
import Link from "next/link";
import { TNote } from "@/lib/types";

export function DailyNote({
  note,
  parsedDate,
}: {
  note: TNote;
  parsedDate: Date;
}) {
  const formattedDate = format(parsedDate, "MMMM d, yyyy");
  const isToday =
    format(new Date(), "yyyy-MM-dd") === format(parsedDate, "yyyy-MM-dd");
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex-between my-4 h-10">
          <p className="text-2xl font-bold">{formattedDate}</p>
          {isToday && !note && (
            <Link href="/notes/today">
              <Button size="icon" variant="outline">
                <PlusIcon className="size-4" />
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
            {/* <div className="mb-4 flex items-center justify-between">
              <p className="text-xl font-semibold">Note</p>
              <span className="text-sm text-muted-foreground">
                {format(new Date(note.updatedAt as Date), "h:mm a")}
              </span>
            </div> */}
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

export function InValidDate() {
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
