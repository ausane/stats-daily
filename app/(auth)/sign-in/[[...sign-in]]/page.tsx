import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex-center h-screen w-screen bg-slate-200">
      <SignIn />
    </div>
  );
}
