import React, { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

export function TaskState({ children }: { children: ReactNode }) {
  return <span className="flex-center w-12">{children}</span>;
}

export function TaskContent({ children }: { children: ReactNode }) {
  return (
    <span className="flex-start relative h-auto w-[calc(100%-8rem)]">
      {children}
    </span>
  );
}

export function TaskOptions({ children }: { children: ReactNode }) {
  return <span className="flex-around w-20">{children}</span>;
}

export function InputRequiredAlert() {
  return (
    <span className="empty-alert">
      <CircleAlert size={15} />
      <span>Task cannot be empty!</span>
    </span>
  );
}
