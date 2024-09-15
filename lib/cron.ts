import cron from "node-cron";
import { dailyStats } from "@/lib/db/daily-stats";

// Schedule a job to run daily at 12 AM
cron.schedule("0 0 * * *", async () => {
  console.log("Running dailyStats job at 12 AM");
  await dailyStats();
});
