import mongoose from "mongoose";
import { TArea, TTask } from "@/lib/types";

const { Schema, model, models } = mongoose;

// Define a sub-schema for the tasks array
export const taskSchema = new Schema<TTask>(
  {
    task: {
      type: String,
      required: true,
      trim: true,
    },
    achieved: {
      type: Number,
      required: true,
      default: 0,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const areaSchema = new Schema<TArea>(
  {
    userId: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    tasks: [taskSchema],
  },
  {
    timestamps: true,
  },
);

export const Area = models.Area || model<TArea>("Area", areaSchema);
