import connectToDatabase from "@/lib/db/mongodb";
import { Note } from "@/models/note.model";
import { startOfDay, endOfDay } from "date-fns";
import { currentUser } from "@/lib/db/stats";
import { TNote } from "./types";

export const getDailyNote = async (date: Date) => {
  try {
    await connectToDatabase();
    const user = await currentUser();

    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const note = await Note.findOne({
      userId: user._id.toString() as string,
      createdAt: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    });

    return note as TNote;
  } catch (error) {
    console.error(error);
  }
};

export const getDailyNotes = async (limit?: number) => {
  try {
    await connectToDatabase();
    const user = await currentUser();

    const notes: TNote[] | null = await Note.find({
      userId: user._id.toString() as string,
    })
      .sort({ createdAt: -1 })
      .limit(limit ?? 10);

    return notes as TNote[];
  } catch (error) {
    console.error(error);
  }
};
