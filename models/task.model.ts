import mongoose from "mongoose";
import { TStat } from "@/lib/types";

const { Schema, model, models } = mongoose;

export const taskSchema = new Schema<TStat>(
    {
        userId: {
            type: String,
            required: true,
        },
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
        ],
    },
    {
        timestamps: true,
    }
);

export const Task = models.Task || model<TStat>("Task", taskSchema);
