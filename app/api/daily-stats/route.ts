import { NextResponse } from "next/server";
import { dailyStats } from "@/lib/daily-stats";

export async function POST(request: Request) {
  // Verify the request is coming from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dailyStats();
    return NextResponse.json(
      { message: "Daily stats job completed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error running daily stats job:", error);
    return NextResponse.json(
      { error: "Failed to run daily stats job" },
      { status: 500 },
    );
  }
}
