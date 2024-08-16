import { InitialState, TTask } from "./types";
import { KeyboardEvent } from "react";

// Key Down Enter Handler to Submit
export const handleKeyDownEnter: (
    event: KeyboardEvent<HTMLInputElement | HTMLDivElement>,
    keyDownAction: () => void
) => void = (event, keyDownAction) => {
    if (event.key === "Enter") {
        event.preventDefault();
        keyDownAction();
    }
};

// Export InitialState of Form Slice
export const initialState: InitialState = {
    area: "",
    note: "",
    task: "",
    tasks: [],
    etem: "",
};

// Sorting function for tasks
export const st = (a: TTask, b: TTask) => {
    return (
        new Date(b.updatedAt ?? 0).getTime() -
        new Date(a.updatedAt ?? 0).getTime()
    );
};

// Task Updating object function
export const ntf = (
    task: string | TTask,
    completed: boolean,
    achieved: number
) => {
    if (typeof task === "string") {
        return { task, completed, achieved };
    } else {
        return { ...task, completed, achieved };
    }
};
