"use client";

import { TStat, TTask } from "@/lib/types";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import TaskInput from "./task-input";
import DailyNote from "./area/daily-note";
import { deleteTask } from "@/lib/utils/handle-delete";
import { updateTask, createNewTask } from "@/lib/utils/handle-update";
import { taskInputsFunc, initTask, parseType } from "@/lib/constants";
import TasksHeader from "./area/tasks-header";
import IconButton from "../icon-button";
import Button from "../ui/button";

export default function TaskList({ data }: { data: TStat }) {
    const { _id, tasks, note } = data;

    const [input, setInput] = useState(Array(tasks?.length).fill(true));
    const [fields, setFields] = useState<TTask[]>([]);
    const [newTask, setNewTask] = useState(initTask);
    const [inputNewTask, setInputNewTask] = useState(false);
    const [shouldFocus, setShouldFocus] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        tasks && setFields([...tasks].reverse());
    }, [tasks]);

    useEffect(() => {
        if (shouldFocus) {
            inputRefs.current[0]?.focus();
            setShouldFocus(false); // Reset shouldFocus after focusing
        }
    }, [inputNewTask, shouldFocus]);

    const editTask = (index: number) => {
        setInputNewTask(false);
        setInput((prev) => {
            return prev.map((_, i) => (i === index ? !prev[index] : true));
        });

        setNewTask({ ...fields[index] });
        setShouldFocus(true);
    };

    const handleUpdateTask = async (index: number) => {
        editTask(index);

        setFields((prev) => {
            const newFields = [...prev];
            newFields[index] = newTask as TTask;
            return newFields;
        });

        await updateTask(_id as string, newTask as TTask);
    };

    const handleDeleteTask = async (taskId: string, index: number) => {
        setFields((prev) => prev.filter((_, i) => i !== index));
        await deleteTask(_id as string, taskId);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const parsedValue = parseType(name, value);

        setNewTask((prev) => ({ ...prev, [name]: parsedValue }));
    };

    const addNewTask = async () => {
        console.log(_id);

        if (!newTask.task || !newTask.unit) {
            console.log("task could not be empty");
        } else {
            setInput((prev) => [true, ...prev]);
            setFields([newTask as TTask, ...fields]);
            setInputNewTask(false);
            setNewTask(initTask);

            await createNewTask(_id as string, newTask as TTask);
        }
    };

    const handleNewTaskInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const parsedValue = parseType(name, value);
        setNewTask((prev) => ({ ...prev, [name]: parsedValue }));
    };

    const handleAddTaskButtonClick = () => {
        setInput((prev) => Array(prev.length).fill(true));
        setInputNewTask(inputNewTask ? false : true);
        setNewTask(initTask);
        setShouldFocus(true);
    };

    return (
        <div className="w-full h-full grow overflow-auto box-border flex-between gap-4">
            <div className="w-8/12 h-full overflow-auto box-border bbn rounded-md max-md:w-full">
                <TasksHeader handleAddTaskButtonClick={handleAddTaskButtonClick}>
                    {inputNewTask && (
                        <div className="flex-between tasks-content">
                            <TaskInput
                                ref={inputRefs}
                                className="w-5/6"
                                inputAttributes={taskInputsFunc(newTask, false)}
                                onChange={handleNewTaskInputChange}
                                submitBtn={btnRef}
                            />
                            <span className="flex-around">
                                <IconButton
                                    variant="icon"
                                    ref={btnRef}
                                    onClick={addNewTask}
                                    src="/plus.svg"
                                    alt="edit"
                                />
                                <IconButton
                                    variant="icon"
                                    onClick={() => setInputNewTask(false)}
                                    src="/cross.svg"
                                    alt="edit"
                                />
                            </span>
                        </div>
                    )}
                </TasksHeader>
                {fields?.map((task, index) => (
                    <div
                        key={index}
                        className={`flex-between tasks-content ${
                            index % 2 === 0 ? "bg-neutral-800" : "bg-neutral-900"
                        }`}
                    >
                        {input[index] ? (
                            <>
                                <span className="flex-start">{task.task}</span>
                                <span>{task.target}</span>
                                <span>{task.achieved}</span>
                                <span>{task.unit}</span>
                                <span className="flex-around">
                                    <IconButton
                                        variant="icon"
                                        onClick={() => editTask(index)}
                                        src="/pencil.svg"
                                        alt="edit"
                                    />
                                    <IconButton
                                        variant="icon"
                                        onClick={() => handleDeleteTask(task._id as string, index)}
                                        src="/trash.svg"
                                        alt="delete"
                                    />
                                </span>
                            </>
                        ) : (
                            <>
                                <TaskInput
                                    ref={inputRefs}
                                    className="w-5/6"
                                    inputAttributes={taskInputsFunc(newTask, false)}
                                    onChange={handleInputChange}
                                    submitBtn={btnRef}
                                />
                                <span className="flex-around">
                                    <IconButton
                                        variant="icon"
                                        ref={btnRef}
                                        onClick={() => handleUpdateTask(index)}
                                        src="/check.svg"
                                        alt="Update"
                                    />
                                    <IconButton
                                        variant="icon"
                                        onClick={() =>
                                            setInput((prev) => Array(prev.length).fill(true))
                                        }
                                        src="/cross.svg"
                                        alt="Update"
                                    />
                                </span>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <DailyNote id={_id as string} note={note as string} />
        </div>
    );
}
