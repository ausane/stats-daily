import { NextResponse } from "next/server";
import { dailyStats } from "@/lib/daily-stats";

export async function POST(request: Request) {
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
