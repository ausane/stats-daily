"use client";

import { AddNewTaskProps, InputChangeEvent, TStat, TTask } from "@/lib/types";
import DailyNote from "./area/daily-note";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TaskListItem from "./task-list-item";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTask } from "@/lib/utils/handle-update";
import {
    ArrowUp,
    X,
    Check,
    Plus,
    CircleAlert,
    Circle,
    CheckCircle2,
} from "lucide-react";
import CircularProgress from "../ui/circular-progress";
import { createNewTask } from "@/lib/utils/handle-update";
import IconButton from "../ui/icon-button";
// import { Button } from "../ui/button";
import {
    setIncompleteTasks,
    setCompleteTasks,
    undoTaskCompletion,
} from "@/features/taskSlice";
import Input from "../ui/input";
import { handleKeyDownEnter } from "@/lib/constants";

export default function TaskList({ data }: { data: TStat }) {
    const { _id, tasks, note } = data;

    const [progress, setProgress] = useState(0);
    const [addTaskInput, setAddTaskInput] = useState(false);
    const [emptyInputAlert, setEmptyInputAlert] = useState(false);

    const cdts = useMemo(
        () => tasks?.filter((task) => task.completed === true),
        [tasks]
    );
    const icts = useMemo(
        () => tasks?.filter((task) => task.completed === false),
        [tasks]
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCompleteTasks(cdts));
        dispatch(setIncompleteTasks(icts));
    }, [cdts, icts, dispatch]);

    // Tasks States
    const completedTasks = useAppSelector((state) => state.task.completedTasks);
    const incompleteTasks = useAppSelector(
        (state) => state.task.incompleteTasks
    );

    // Progress Animation
    useEffect(() => {
        const calculateProgress = () => {
            if (!completedTasks.length && !incompleteTasks.length) return 0;

            const achievedArray = completedTasks.map((item) => item.achieved);
            const total = achievedArray.reduce((sum, num) => sum + num, 0);
            const target = completedTasks.length + incompleteTasks.length;

            return parseInt((total / target).toFixed(), 10);
        };

        const targetProgress = calculateProgress();

        // Animate the progress from 0 to the target value
        let currentProgress = 0;
        const increment = targetProgress / 100; // Adjust this to control the speed
        const interval = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= targetProgress) {
                currentProgress = targetProgress;
                clearInterval(interval);
            }
            setProgress(parseInt(currentProgress.toFixed(), 10));
        }, 10); // Adjust the interval timing to control the speed of animation

        return () => clearInterval(interval);
    }, [completedTasks]);

    return (
        <div className="size-full grow overflow-auto box-border flex-between gap-4">
            <div className="w-8/12 h-full overflow-auto box-border bbn rounded-md relative max-lg:w-full">
                <div className="w-full h-10 flex-between sticky top-0 border-b px-2 pr-4 box-border bg-secondary">
                    <span className="w-12 flex-center opacity-50">
                        <Circle />
                    </span>
                    <p className="h-full flex-center font-medium opacity-50">
                        {incompleteTasks.length} Incomplete
                        {incompleteTasks.length === 1 ? " Task" : " Tasks"}
                    </p>
                    <span>
                        <IconButton
                            variant="ghost"
                            circle={true}
                            className={`transition-transform duration-400 ease-in-out hover:bg-border p-0 ${
                                addTaskInput ? "rotate-45" : "rotate-90"
                            }`}
                            onClick={() => {
                                setAddTaskInput(!addTaskInput);
                                setEmptyInputAlert(false);
                            }}
                        >
                            <Plus />
                        </IconButton>
                    </span>
                </div>

                <div className="w-full h-[calc(100%-5rem)] overflow-auto overflow-x-hidden">
                    <AddNewTask
                        areaId={_id as string}
                        addTaskInput={addTaskInput}
                        setAddTaskInput={setAddTaskInput}
                        emptyInputAlert={emptyInputAlert}
                        setEmptyInputAlert={setEmptyInputAlert}
                    />
                    {incompleteTasks?.map((item, index) => (
                        <div
                            key={index}
                            className="w-full flex flex-col bbn p-2"
                        >
                            <TaskListItem
                                areaId={_id as string}
                                taskItem={item}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
                <ShowCompletedTasks
                    areaId={_id as string}
                    completedTasks={completedTasks}
                />
            </div>
            <div className="w-1/3 h-full max-sm:hidden max-lg:hidden max-lg:block max-md:block">
                <CircularProgress progress={progress} />
                <DailyNote id={_id as string} note={note as string} />
            </div>
        </div>
    );
}

export function ShowCompletedTasks({
    areaId,
    completedTasks,
}: {
    areaId: string;
    completedTasks: TTask[];
}) {
    const [open, setOpen] = useState(false);

    const dispatch = useAppDispatch();

    const handleUndoTask = async (index: number) => {
        const task = {
            ...completedTasks[index],
            completed: false,
            achieved: 0,
        };

        dispatch(undoTaskCompletion(index));

        await updateTask(areaId, task as TTask);
    };

    return (
        <div
            className={`border-t w-full absolute bottom-0 left-0 bg-background transition-all duration-400 ease-in-out overflow-hidden 
                ${open ? "h-full" : "h-10"}`}
        >
            <div className="w-full h-10 bg-secondary sticky top-0 left-0 border-b flex-between px-2 pr-4">
                <span className="w-12 flex-center opacity-50">
                    <CheckCircle2 />
                </span>
                <p className="h-full flex-center font-medium opacity-50">
                    {completedTasks.length} Completed
                    {completedTasks.length === 1 ? " Task" : " Tasks"}
                </p>
                <IconButton
                    variant="ghost"
                    circle={true}
                    className={`transition-transform duration-400 ease-in-out hover:bg-border p-0 ${
                        open ? "rotate-180" : "rotate-0"
                    }`}
                    // className="transition-all duration-400 ease-in-out rotate-180"
                    onClick={() => setOpen(!open)}
                >
                    <ArrowUp />
                </IconButton>
            </div>
            <div
                className={`h-[calc(100%-2.5rem)] flex-col overflow-auto 
                    ${open ? "flex" : "hidden"} `}
            >
                {completedTasks?.map((item, index) => (
                    <div key={index} className="w-full flex-between bbn p-2">
                        <span className="w-1/6 flex-center">
                            <button
                                onClick={() => handleUndoTask(index)}
                                className="status-button bg-red-700 hover:bg-red-800"
                            ></button>
                        </span>
                        <span className="w-4/6 flex-start">
                            <p className="truncate">{item.task}</p>
                        </span>
                        <span className="w-1/6 flex-center">
                            <p>{item.achieved.toString()}%</p>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AddNewTask({
    areaId,
    addTaskInput,
    emptyInputAlert,
    setAddTaskInput,
    setEmptyInputAlert,
}: AddNewTaskProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [newTaskValue, setNewTaskValue] = useState("");

    useEffect(() => {
        if (addTaskInput) inputRef.current?.focus();
    }, [addTaskInput]);

    const dispatch = useAppDispatch();

    const addNewTask = async () => {
        if (!newTaskValue.trim()) {
            setNewTaskValue("");
            setEmptyInputAlert(true);
            return;
        }

        setAddTaskInput(false);
        setNewTaskValue("");

        const newTask = {
            task: newTaskValue,
            completed: false,
            achieved: 0,
        };
        const { newIncompleteTasks } = await createNewTask(
            areaId as string,
            newTask
        );
        dispatch(setIncompleteTasks(newIncompleteTasks));
    };

    const handleNewTaskInputChange = (event: InputChangeEvent) => {
        const { value } = event.target;
        setNewTaskValue(value);
        setEmptyInputAlert(value ? false : true);
    };

    if (addTaskInput) {
        return (
            <div className="flex p-2">
                <span className="w-12 flex-center">
                    <span className="status-button bg-green-400"></span>
                </span>
                <span className="w-[calc(100%-8rem)] ml-2 flex-start relative">
                    <Input
                        ref={inputRef}
                        type="text"
                        name="task"
                        labelClasses="w-5/6"
                        value={newTaskValue}
                        onChange={handleNewTaskInputChange}
                        onKeyDown={(e) => handleKeyDownEnter(e, addNewTask)}
                    />
                    {emptyInputAlert && (
                        <span className="empty-alert">
                            <CircleAlert size={15} />
                            <span>Task cannot be empty!</span>
                        </span>
                    )}
                </span>
                <span className="w-20 flex-around">
                    <IconButton variant="default" onClick={addNewTask}>
                        <Check size={15} />
                    </IconButton>
                    <IconButton
                        variant="default"
                        onClick={() => {
                            setAddTaskInput(false);
                            setNewTaskValue("");
                        }}
                    >
                        <X size={15} />
                    </IconButton>
                </span>
            </div>
        );
    }
}
