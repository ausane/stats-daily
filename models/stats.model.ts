import mongoose from "mongoose";
import { taskSchema } from "./task.model";
import { TStats } from "@/lib/types";

const { Schema, model, models } = mongoose;

const statsSchema = new Schema<TStats>(
  {
    stats: [
      {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Stats = models.Stats || model<TStats>("Stats", statsSchema);
