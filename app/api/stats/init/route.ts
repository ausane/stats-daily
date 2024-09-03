import { NextResponse } from "next/server";
import { tasksArray } from "@/lib/constants";
import { Area } from "@/models/task.model";
import connectToDatabase from "@/lib/db/mongodb";

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const { userId } = (await request.json()) as { userId: string };
    const initValue = tasksArray.map((item) => {
      return { ...item, userId: userId };
    });

    const savedValue = await Area.create(initValue);
    const rid = savedValue[0]._id.toString();

    return NextResponse.json({ rid, success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
