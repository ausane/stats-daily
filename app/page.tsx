import HomePage from "@/components/home-page";
import { fetchTasks } from "@/lib/db/stats";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (!userId) return <HomePage />;

  const areas = await fetchTasks();

  return redirect(`/areas/${areas?.length ? areas[0]._id : "create"}`);
}
