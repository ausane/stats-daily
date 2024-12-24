"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, PlusIcon } from "lucide-react";
import Link from "next/link";
import { TNote } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DailyNote({
  note,
  parsedDate,
}: {
  note: TNote;
  parsedDate: Date;
}) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  const formattedDate = format(parsedDate, "MMMM d, yyyy");
  const isToday =
    format(new Date(), "yyyy-MM-dd") === format(parsedDate, "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-background p-4 pb-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex-between my-4 h-10">
          <p className="text-2xl font-bold">{formattedDate}</p>
          <Link href="/notes/today">
            <Button size="icon" variant="outline">
              {isToday ? (
                note ? (
                  <Pencil className="size-4" />
                ) : (
                  <PlusIcon className="size-4" />
                )
              ) : (
                <p className="text-lg font-medium">T</p>
              )}
            </Button>
          </Link>
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
        <p className="text-2xl font-bold text-gray-800">Invalid Date</p>
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

export function DailyNotes({ notes }: { notes: TNote[] }) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex-between mb-8">
        <p className="text-3xl font-bold">Daily Notes</p>
        <Link href="/notes/today">
          <Button size="icon" variant="outline">
            <p className="text-lg font-medium">T</p>
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note._id as string}
            className="cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
            onClick={() =>
              router.push(`/notes/${note.createdAt?.toString().split("T")[0]}`)
            }
          >
            <CardHeader className="border-b text-xl font-bold">
              <CardTitle className="text-base text-primary">
                {format(note.createdAt as Date, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div
                className="line-clamp-3 text-sm"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
