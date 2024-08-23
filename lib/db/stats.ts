import connectToDatabase from "@/lib/db/mongodb";
import { Area } from "@/models/task.model";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export const fetchTasks = async () => {
  await connectToDatabase();
  const { userId } = auth();

  try {
    const response = await Area.find({ userId }).sort({ updatedAt: -1 });
    if (!response) throw new Error("Area not found!");

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
        areaId: task._id.toString(),
        areaName: task.area,
      };
    });

    return tasks;
  } else {
    // Handle the case when response is void
    console.error("Tasks not found!");
  }
};

export const fetchAreaById = async (areaId: string) => {
  await connectToDatabase();
  const isValidObjectId = mongoose.Types.ObjectId.isValid(areaId);

  try {
    // Throw an error if id is invalid
    if (!isValidObjectId) throw new Error("Invalid id!");

    const response = await Area.findById(areaId);
    if (!response) throw new Error("Area not found!");

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