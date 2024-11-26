import { Area } from "@/models/task.model";
import connectToDatabase from "./db/mongodb";
import { Stats } from "@/models/stats.model";
import { TArea, TStats, OmitDocument, taskStats, TTask } from "./types";
import { currentUser } from "./db/stats";

export const dailyStats = async () => {
  await connectToDatabase();

  try {
    const stats: TArea[] = await Area.find();

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
      return ns;
    });

    await Stats.create(toStats);
    await Area.updateMany(
      { tasks: { $exists: true } },
      { $set: { "tasks.$[].achieved": 0, "tasks.$[].completed": false } },
    );
  } catch (error) {
    console.error(error);
  }
};

export const statsdaily = async (count: number) => {
  await connectToDatabase();

  try {
    const { _id: userId } = await currentUser();
    return await Stats.find({ userId }).sort({ createdAt: -1 }).limit(count);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const taskStatsArray = (stats: TArea[], userId: string) => {
  const userStats = stats.filter((item) => item.userId === userId);

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
