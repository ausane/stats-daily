"use client";

import { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { X, CircleAlert } from "lucide-react";
import Input from "@/components/ui/input";
import IconButton from "@/components/ui/icon-button";
import { InputChangeEvent } from "@/lib/types";
import {
    handleTaskChange,
    addToTasks,
    handleErrMsg,
    removeTask,
} from "@/features/formSlice";

export default function CreateTasks() {
    const inputRef = useRef<HTMLInputElement>(null);

    const task = useAppSelector((state) => state.form.task);
    const tasks = useAppSelector((state) => state.form.tasks);

    const [placeholder, setPlaceholder] = useState("");

    const dispatch = useAppDispatch();

    const handleTaskInputChange = (event: InputChangeEvent) => {
        setPlaceholder("");
        dispatch(handleTaskChange(event.target.value));
    };

    const handleTaskSubmit = () => {
        if (task.trim()) {
            dispatch(addToTasks());
            dispatch(handleErrMsg(""));

            inputRef?.current?.focus();
        } else {
            dispatch(handleTaskChange(""));
            setPlaceholder("Area cannot be empty!");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleTaskSubmit();
        }
    };

    return (
        <div className="w-3/5 h-full border-l max-sm:border-0 max-sm:w-full">
            <div className="w-full flex-between gap-4 p-4 h-24 border-b">
                <span className="w-full flex-start relative">
                    <Input
                        label="Task"
                        ref={inputRef}
                        type="text"
                        name="task"
                        value={task}
                        onChange={handleTaskInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full h-10 mt-1 rounded-md"
                        labelClasses="w-full"
                        // required
                    />
                    {placeholder && (
                        <span className="empty-alert w-full h-10 self-end">
                            <CircleAlert size={15} />
                            <span>{placeholder}</span>
                        </span>
                    )}
                </span>
                <Button
                    type="button"
                    className="self-end"
                    onClick={handleTaskSubmit}
                >
                    Add
                </Button>
            </div>

            <div className="h-[calc(100%-6rem)] overflow-auto">
                {!tasks.length && (
                    <div className="w-full h-full flex-center opacity-50">
                        <p>Your tasks will appear here</p>
                    </div>
                )}
                {tasks.map((item, index) => (
                    <div key={index} className="flex-between p-2 border-b">
                        <span className="w-11/12 flex-start gap-4">
                            <span className="w-8 h-8 bbn flex-center rounded">
                                {index + 1}
                            </span>
                            <p className="truncate w-5/6">{item.task}</p>
                        </span>

                        <IconButton
                            type="button"
                            variant="ghost"
                            className="rounded-full"
                            onClick={() => dispatch(removeTask(index))}
                        >
                            <X size={15} />
                        </IconButton>
                    </div>
                ))}
            </div>
        </div>
    );
}
