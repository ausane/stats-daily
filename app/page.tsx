import HomePage from "@/components/home-page";
import { fetchTasks } from "@/lib/db/stats";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  // console.log(session);
  if (!session) return <HomePage />;

  const areas = await fetchTasks();

  return redirect(`/areas/${areas?.length ? areas[0]._id : "create"}`);
}
