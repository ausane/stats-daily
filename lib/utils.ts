import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { KeyboardEvent } from "react";
import { TTask } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Key Down Enter Handler to Submit
export const handleKeyDownEnter: (
  event: KeyboardEvent<HTMLInputElement | HTMLDivElement>,
  keyDownAction: () => void,
) => void = (event, keyDownAction) => {
  if (event.key === "Enter") {
    event.preventDefault();
    keyDownAction();
  }
};

// Sorting function for tasks
export const st = (a: TTask, b: TTask) => {
  return (
    new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
  );
};

// Task updating object function
export const ntf = (
  task: string | TTask,
  completed: boolean,
  achieved: number,
) => ({
  ...(typeof task === "string" ? { task } : task),
  completed,
  achieved,
});

// Parse stringify object function
export const ps = (obj: object) => JSON.parse(JSON.stringify(obj));
