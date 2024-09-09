import HomePage from "@/components/home-page";
import { fetchTasks } from "@/lib/db/stats";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await stackServerApp.getUser();
  if (!user) return <HomePage />;

  const areas = await fetchTasks();

  return redirect(`/areas/${areas?.length ? areas[0]._id : "create"}`);
}
