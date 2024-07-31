import connectToDatabase from "@/lib/mongodb";
import { Task } from "@/models/task.model";
import mongoose from "mongoose";

export const fetchTasks = async () => {
    await connectToDatabase();

    try {
        const response = await Task.find({}).sort({ createdAt: -1 });
        if (!response) throw new Error("Task not found");

        return response;
    } catch (error) {
        consoleError(error);
    }
};

export const fetchAreas = async () => {
    const response = await fetchTasks();

    if (response) {
        const tasks = response.map((task) => {
            return {
                _id: task._id.toString(),
                area: task.area,
            };
        });

        return tasks;
    } else {
        // Handle the case when response is void
        console.error("No tasks found.");
    }
};

export const fetchAreaById = async (id: string) => {
    await connectToDatabase();
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    try {
        // Throw an error if id is invalid
        if (!isValidObjectId) throw new Error("Invalid id");

        const response = await Task.findById(id);
        if (!response) throw new Error("Task not found");

        return response;
    } catch (error) {
        consoleError(error);
    }
};

export const consoleError = (error: unknown): void => {
    error instanceof Error
        ? console.error("Error:", error.message)
        : console.error("Error: An unknown error occurred");
};
