import { TNote } from "@/lib/types";
import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema<TNote>(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

export const Note = models.Note || model<TNote>("Note", NoteSchema);
