import connectToDatabase from "@/lib/db/mongodb";
import { Area } from "@/models/task.model";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { User } from "@/models/user.model";
import { TArea, TUser } from "../types";

// To Get Current User
export const currentUser = async () => {
  const session = await getServerSession();
  return await User.findOne({ email: session?.user?.email });
};

// To Get All Areas of Current User
export const fetchTasks = async () => {
  await connectToDatabase();

  try {
    const user: TUser = await currentUser();
    const userId = user?._id?.toString() as string;

    const areas = await Area.find({ userId }).sort({
      updatedAt: -1,
    });
    if (!areas.length) throw new Error("Area not found!");

    return areas;
  } catch (error) {
    consoleError(error);
  }
};

// To Get Areas for Sidebar Content
export const fetchAreas = async () => {
  const response: TArea[] | undefined = await fetchTasks();

  if (response) {
    const tasks = response.map((task) => {
      return {
        areaId: task._id?.toString(),
        areaName: task.area,
      };
    });

    return tasks;
  } else {
    // Handle the case when response is void
    console.error("Tasks not found!");
  }
};

// To Get Area by Id of Current User
export const fetchAreaById = async (areaId: string) => {
  await connectToDatabase();
  const isValidObjectId = Types.ObjectId.isValid(areaId);

  try {
    // Throw an error if id is invalid
    if (!isValidObjectId) throw new Error("Invalid id!");

    const user = await currentUser();
    const areas: TArea[] = await Area.find({ userId: user._id });

    if (!areas.length) throw new Error("Area not found!");
    return areas.find((area) => area._id?.toString() === areaId);
  } catch (error) {
    consoleError(error);
  }
};

export const consoleError = (error: unknown): void => {
  error instanceof Error
    ? console.error("Error:", error.message)
    : console.error("Error: An unknown error occurred");
};
