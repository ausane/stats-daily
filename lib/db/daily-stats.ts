import { Area } from "@/models/task.model";
import connectToDatabase from "./mongodb";
import { Stats } from "@/models/stats.model";
import { TArea, TStats, OmitDocument, taskStats, TTask } from "../types";
import { tasksArray } from "../constants";

export const dailyStats = async () => {
  await connectToDatabase();

  try {
    const stats: TArea[] = await Area.find();
    // console.log(stats);

    const uniqueStats = stats?.filter(
      (item, index, self) =>
        index === self.findIndex((s) => s.userId === item.userId),
    );

    const toStats = uniqueStats?.map((item) => {
      const ns: OmitDocument<TStats> = {
        userId: item.userId,
        // note: item.note,
        taskStats: taskStatsArray(stats, item.userId),
      };
      // console.log(ns);
      return ns;
    });

    // console.log(toStats);

    // await Stats.deleteMany();
    await Stats.create(toStats);
    // return newStats;
  } catch (error) {
    console.error(error);
  }
};

export const statsdaily = async (userId: string, count: number) => {
  await connectToDatabase();
  // await dailyStats();
  console.log((await Stats.find({ userId })).length);
  return await Stats.find({ userId }).sort({ createdAt: -1 }).limit(count);
};

export const taskStatsArray = (stats: TArea[], userId: string) => {
  const userStats = stats.filter((item) => item.userId === userId);
  // console.log(userStats);

  const taskStats: taskStats[] = userStats.map((item) => {
    const obj: taskStats = {
      area: item.area,
      note: item.note as string,
      total: item.tasks.length,
      achieved: calcAchieved(item.tasks),
      completed: item.tasks.filter((i) => i.completed).length,
    };
    return obj;
  });

  return taskStats;
};

export const calcAchieved = (tasks: TTask[]) => {
  const totalAchieved = tasks?.reduce((t, i) => t + i.achieved, 0);
  return Math.floor(totalAchieved / tasks.length);
};

export async function cleanTask(userId: string) {
  await connectToDatabase();

  try {
    const newArea = tasksArray.map((item) => {
      return { ...item, userId: userId };
    });
    console.log(newArea);
    await Area.create(newArea);
    // await Area.deleteMany({ userId });
    // await Stats.deleteMany();
  } catch (error) {
    console.error(error);
  }
}
