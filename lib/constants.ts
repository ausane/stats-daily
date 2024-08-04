import { InitialState } from "./types";
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
    errMsg: "",
};
