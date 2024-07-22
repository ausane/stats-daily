import mongoose from "mongoose";
import { TStat } from "@/lib/types";

const { Schema, model, models } = mongoose;

export const taskSchema = new Schema<TStat>(
    {
        area: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        note: {
            type: String,
            trim: true,
        },
        tasks: [
            {
                task: {
                    type: String,
                    unique: true,
                    required: true,
                    trim: true,
                },
                target: {
                    type: Number,
                    required: true,
                    default: 1,
                },
                achieved: {
                    type: Number,
                    required: true,
                    default: 0,
                },
                unit: {
                    type: String,
                    required: true,
                    trim: true,
                    default: "unit",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Task = models.Task || model<TStat>("Task", taskSchema);
