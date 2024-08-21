import mongoose from "mongoose";
import { TStats } from "@/lib/types";

const { Schema, model, models } = mongoose;

const statsSchema = new Schema<TStats>(
  {
    userId: {
      type: String,
      required: true,
    },
    taskStats: [
      {
        area: {
          type: String,
          required: true,
        },
        note: {
          type: String,
          trim: true,
        },
        total: {
          type: Number,
          required: true,
          default: 0,
        },
        completed: {
          type: Number,
          required: true,
          default: 0,
        },
        achieved: {
          type: Number,
          required: true,
          default: 0,
        },
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
