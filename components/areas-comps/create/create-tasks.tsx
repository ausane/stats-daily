"use client";

import { useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import TaskInput from "../task-input";
import { parseType, taskInputsFunc } from "@/lib/constants";
import Button from "@/components/ui/button";
import { handleTaskChange, addToTasks, handleErrMsg, deleteTask } from "@/features/formSlice";

export default function CreateTasks() {
    const btnRef = useRef<HTMLButtonElement>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const task = useAppSelector((state) => state.form.task);
    const tasks = useAppSelector((state) => state.form.tasks);
    const errMsg = useAppSelector((state) => state.form.errMsg);

    const dispatch = useAppDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const parsedValue = parseType(name, value);

        dispatch(
            handleTaskChange({
                name,
                value: parsedValue,
            })
        );
    };

    const handleTaskSubmit = () => {
        const trueTask = task.task && task.target && task.unit;
        if (trueTask) {
            dispatch(addToTasks());
            dispatch(handleErrMsg(""));

            inputRefs?.current[0]?.focus();
        } else {
            dispatch(handleErrMsg("Please enter task, target and unit"));
        }
    };

    return (
        <div className="w-full bbn p-4">
            <div className="flex-between">
                <TaskInput
                    ref={inputRefs}
                    className="bg-transparent w-4/5 rounded p-1"
                    labelClasses="flex flex-col gap-1"
                    inputAttributes={taskInputsFunc(task, true)}
                    onChange={handleChange}
                    submitBtn={btnRef}
                />
                <Button variant="rect" ref={btnRef} className="self-end" onClick={handleTaskSubmit}>
                    Add
                </Button>
            </div>

            {errMsg && <p className="text-red-400">{errMsg}</p>}

            <div className="bbn mt-4">
                {tasks.map(({ task, target, achieved, unit }, index) => (
                    <div
                        key={index}
                        className={`flex-between tasks-content ${
                            index % 2 === 0 ? "bg-neutral-800" : "bg-neutral-900"
                        }`}
                    >
                        <span>{task}</span>
                        <span>{target}</span>
                        <span>{achieved}</span>
                        <span>{unit}</span>
                        <Button variant="rect" onClick={() => dispatch(deleteTask(index))}>
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
