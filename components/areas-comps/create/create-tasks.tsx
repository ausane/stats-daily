"use client";

import { useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import TaskInput from "../task-input";
// import { parseType, taskInputsFunc } from "@/lib/constants";
// import Button from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
    handleTaskChange,
    addToTasks,
    handleErrMsg,
    removeTask,
} from "@/features/formSlice";
import Input from "@/components/ui/input";
import IconButton from "@/components/ui/icon-button";

export default function CreateTasks() {
    const btnRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const task = useAppSelector((state) => state.form.task);
    const tasks = useAppSelector((state) => state.form.tasks);
    const errMsg = useAppSelector((state) => state.form.errMsg);

    const dispatch = useAppDispatch();

    const handleTaskInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        // const parsedValue = parseType(name, value);

        // console.log(name, value);
        dispatch(handleTaskChange(value));
    };

    const handleTaskSubmit = () => {
        // const trueTask = task.task && task.target && task.unit;
        if (task) {
            dispatch(addToTasks());
            dispatch(handleErrMsg(""));

            inputRef?.current?.focus();
        } else {
            dispatch(handleErrMsg("Please enter task"));
        }
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleTaskSubmit();
            // btnRef.current?.click();
        }
    };

    return (
        <div className="w-2/3 h-full bbn">
            <div className="flex-between p-4 h-20">
                {/* <TaskInput
                    ref={inputRefs}
                    className="bg-transparent w-4/5 rounded p-1"
                    labelClasses="flex flex-col gap-1"
                    inputAttributes={taskInputsFunc(task, true)}
                    onChange={handleChange}
                    submitBtn={btnRef}
                /> */}
                <Input
                    label="Task:"
                    ref={inputRef}
                    type="text"
                    name="task"
                    value={task}
                    onChange={handleTaskInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-4/5 h-10"
                    labelClasses="flex-between w-4/5"
                    // required
                />
                <Button
                    // variant="outline"
                    // ref={btnRef}
                    type="button"
                    // className="self-end"
                    onClick={handleTaskSubmit}
                >
                    Add
                </Button>
            </div>

            {errMsg && <p className="text-red-400">{errMsg}</p>}

            <div className="bbn h-[calc(100%-5rem)] overflow-auto">
                {tasks.map((item, index) => (
                    <div
                        key={index}
                        className="flex-between p-1 border-b"
                        // className= {`flex-between p-1 ${
                        //     index % 2 === 0 ? "bg-primary" : "bg-secondary"
                        // }`}
                    >
                        <span className="w-8 h-8 bbn flex-center">{index}</span>
                        <span className="truncate w-4/6 flex-start ml-4">
                            <p>{item.task}</p>
                        </span>

                        <IconButton
                            type="button"
                            onClick={() => dispatch(removeTask(index))}
                        >
                            <X />
                        </IconButton>
                    </div>
                ))}
            </div>
        </div>
    );
}
