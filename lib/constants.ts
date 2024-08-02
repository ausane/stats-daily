import { TTask, OmitDocument, InitialState } from "./types";
import { ImageProps } from "next/image";

export const handleKeyDownEnter: (
    event: React.KeyboardEvent<HTMLInputElement>,
    keyDownAction: () => void
) => void = (event, keyDownAction) => {
    if (event.key === "Enter") {
        event.preventDefault();
        keyDownAction();
    }
};

// export const emptyInputAlert: (
//     event: React.ChangeEvent<HTMLInputElement>,
//     setInputTask: React.Dispatch<React.SetStateAction<string>>,
//     setPlaceholder: React.Dispatch<React.SetStateAction<string>>
// ) => void = (event, setInputTask, setPlaceholder) => {
//     const value = event.target.value;
//     setInputTask(value);
//     setPlaceholder(value ? "" : "Task could not be empty!");
// };

// Export Task Input Array
// export function taskInputsFunc(
//     inputValues: OmitDocument<TTask>,
//     label: boolean
// ) {
//     const taskInputsArray = [
//         {
//             label: label ? "Task:" : "",
//             name: "task",
//             type: "text",
//             value: inputValues.task,
//         },
//         {
//             label: label ? "Target:" : "",
//             name: "target",
//             type: "number",
//             value: inputValues.target,
//         },
//         {
//             label: label ? "Achieved:" : "",
//             name: "achieved",
//             type: "number",
//             value: inputValues.achieved,
//         },
//         {
//             label: label ? "Unit:" : "",
//             name: "unit",
//             type: "text",
//             value: inputValues.unit,
//         },
//     ];

//     return taskInputsArray;
// }

// Export Init Task Object
// export const initTask: OmitDocument<TTask> = {
//     task: "",
//     target: 1,
//     achieved: 0,
//     unit: "",
// };

// Export InitialState of Form Slice
export const initialState: InitialState = {
    area: "",
    note: "",
    task: "",
    tasks: [],
    errMsg: "",
};

// Parse Type
// export const parseType = (name: string, value: string) => {
//     const parsedValue = parseInt(value, 10);

//     if (name === "target") {
//         return isNaN(parsedValue) ? 1 : parsedValue;
//     } else if (name === "achieved") {
//         return isNaN(parsedValue) ? 0 : parsedValue;
//     }

//     return value;
// };

// Manually list the ImageProps keys
export const imagePropsKeys: (keyof ImageProps)[] = [
    "src",
    "alt",
    "width",
    "height",
    "layout",
    "loader",
    "quality",
    "priority",
    "placeholder",
    "blurDataURL",
    "objectFit",
    "objectPosition",
    "onLoadingComplete",
    "unoptimized",
];
