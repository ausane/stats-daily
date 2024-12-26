import { ReactNode } from "react";
import { SDIcon } from "../home-page";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex-center h-screen">
      <div className="bbn rounded-lg p-8 shadow-md shadow-indigo-500/50 hover:shadow-sm">
        <span className="flex-center mb-8 w-full gap-4">
          <SDIcon />
          <p className="text-2xl font-bold">StatsDaily</p>
        </span>
        {children}
      </div>
    </div>
  );
}
