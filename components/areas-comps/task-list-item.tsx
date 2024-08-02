"use client";

import { TStat, TTask } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
// import Button, { IconButton } from "../ui/icon-button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ConfirmDialog, { DialogDemo } from "../confirm-dialog";
import { Slider } from "../ui/slider";
import { updateTask } from "@/lib/utils/handle-update";
import { Check, Cable, CircleAlert, Pencil, Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import IconButton from "../ui/icon-button";
import { deleteTask } from "@/lib/utils/handle-delete";
import Input from "../ui/input";
import { handleKeyDownEnter } from "@/lib/constants";
import {
    setTaskCompletion,
    removeTaskById,
    setEditedTask,
} from "@/features/taskSlice";

export default function TaskListItem({
    taskItem,
    index,
    areaId,
}: {
    taskItem: TTask;
    index: number;
    areaId: string;
}) {
    const task = taskItem.task;
    const inputRef = useRef<HTMLInputElement>(null);

    const [inputTask, setInputTask] = useState(task);
    const [placeholder, setPlaceholder] = useState("");
    const [openInputTask, setOpenInputTask] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (openInputTask) inputRef.current?.focus();
    }, [openInputTask]);

    const handleEditClick = () => {
        setPlaceholder("");
        setOpenInputTask(true);
        setInputTask(task);
    };

    const handleEditTask = async () => {
        if (!inputTask.trim()) {
            setInputTask("");
            setPlaceholder("Task could not be empty!");
            return;
        }

        // console.log("task!");
        dispatch(setEditedTask({ index, task: inputTask }));
        setOpenInputTask(false);

        const taskObj = {
            ...taskItem,
            task: inputTask,
        };

        await updateTask(areaId, taskObj as TTask);
    };

    const handleEditInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setInputTask(value);
        setPlaceholder(value ? "" : "Task could not be empty!");
    };

    return (
        <>
            <div className="w-full flex-between">
                <>
                    <span className="w-1/6 flex-center">
                        <TaskStatus
                            index={index}
                            areaId={areaId}
                            openInputTask={openInputTask}
                            taskItem={taskItem}
                        />
                    </span>

                    <span className="relative flex-start w-4/6">
                        {openInputTask ? (
                            <>
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    name="task"
                                    value={inputTask}
                                    onChange={handleEditInputChange}
                                    onKeyDown={(e) =>
                                        handleKeyDownEnter(e, handleEditTask)
                                    }
                                />
                                {placeholder && (
                                    <span className="absolute ml-2 flex-start text-sm gap-1 opacity-50 text-red-500 -z-10">
                                        <CircleAlert size={15} />
                                        <span>Task could not be empty!</span>
                                    </span>
                                )}
                            </>
                        ) : (
                            <p className="truncate">{task}</p>
                        )}
                    </span>

                    <span className="flex-around w-1/6">
                        <TaskOptions
                            areaId={areaId}
                            handleEditClick={handleEditClick}
                            handleEditTask={handleEditTask}
                            taskId={taskItem._id as string}
                            openInputTask={openInputTask}
                            setOpenInputTask={setOpenInputTask}
                        />
                    </span>
                </>
            </div>
        </>
    );
}

export function TaskStatus({
    areaId,
    index,
    openInputTask,
    taskItem,
}: // setOpenInputTask,
{
    areaId: string;
    index: number;
    openInputTask: boolean;
    taskItem: TTask;
    // setOpenInputTask: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useAppDispatch();

    // Ensure the state is typed as number[]
    const [value, setValue] = useState<number[]>([50]);

    const handleClick = async () => {
        const taskObj = {
            ...taskItem,
            completed: true,
            achieved: value[0],
        };
        // const perc = value[0];
        dispatch(setTaskCompletion({ index, achieved: value[0] }));

        setOpenDialog(false);
        await updateTask(areaId, taskObj as TTask);
        // console.log("save", taskObj);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleClick();
        }
    };

    if (openInputTask) {
        return (
            <button className="w-4 h-4 bbn rounded-full p-0 bg-blue-400 hover:bg-blue-500"></button>
        );
    } else {
        return (
            <DialogDemo
                onClick={handleClick}
                task={taskItem.task}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            >
                <div className="w-full flex-between">
                    <Slider
                        className="w-4/5"
                        // defaultValue={[80]}
                        min={1}
                        max={100}
                        step={1}
                        value={value}
                        onValueChange={(newValue) => setValue(newValue)}
                        onKeyDown={handleKeyDown}
                    />
                    <span>{value}%</span>
                </div>
            </DialogDemo>
        );
    }
}

export function TaskOptions({
    areaId,
    taskId,
    openInputTask,
    handleEditClick,
    handleEditTask,
    setOpenInputTask,
}: {
    areaId: string;
    taskId: string;
    openInputTask: boolean;
    handleEditClick: () => void;
    handleEditTask: () => void;
    setOpenInputTask: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useAppDispatch();
    const handleDeleteTask = async () => {
        // console.log(1);
        dispatch(removeTaskById(taskId));
        await deleteTask(areaId, taskId);
    };

    if (openInputTask) {
        return (
            <>
                <IconButton onClick={handleEditTask}>
                    <Check />
                </IconButton>
                <IconButton onClick={() => setOpenInputTask(false)}>
                    <X />
                </IconButton>
            </>
        );
    } else {
        return (
            <>
                <IconButton onClick={handleEditClick}>
                    <Pencil />
                </IconButton>
                <IconButton onClick={handleDeleteTask}>
                    <Trash />
                </IconButton>
            </>
        );
    }
}
