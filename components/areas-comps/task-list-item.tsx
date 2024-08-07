"use client";

import { TTask } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { CompletionDialog } from "../confirm-dialog";
import { Slider } from "../ui/slider";
import { updateTask } from "@/lib/utils/handle-update";
import IconButton from "../ui/icon-button";
import { deleteTask } from "@/lib/utils/handle-delete";
import Input from "../ui/input";
import { handleKeyDownEnter } from "@/lib/constants";
import { Check, CircleAlert, Pencil, Trash, X } from "lucide-react";
import {
    setTaskCompletion,
    removeTaskById,
    setEditedTask,
} from "@/features/taskSlice";

export default function TaskListItem({
    index,
    areaId,
    taskItem,
}: {
    index: number;
    areaId: string;
    taskItem: TTask;
}) {
    const task = taskItem.task;
    const inputRef = useRef<HTMLInputElement>(null);

    const [inputTask, setInputTask] = useState(task);
    const [placeholder, setPlaceholder] = useState("");
    const [openInputTask, setOpenInputTask] = useState(false);

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
            setPlaceholder("Task cannot be empty!");
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
        setPlaceholder(value ? "" : "Task cannot be empty!");
    };

    const handleDeleteTask = async () => {
        dispatch(removeTaskById(taskItem._id as string));
        await deleteTask(areaId, taskItem._id as string);
    };

    return (
        <>
            <div className="w-full flex-between">
                <>
                    <span className="w-12 flex-center">
                        <TaskStatus
                            index={index}
                            areaId={areaId}
                            openInputTask={openInputTask}
                            taskItem={taskItem}
                        />
                    </span>

                    <span className="relative flex-start w-[calc(100%-8rem)] ml-2">
                        {openInputTask ? (
                            <>
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    name="task"
                                    labelClasses="w-5/6"
                                    value={inputTask}
                                    onChange={handleEditInputChange}
                                    onKeyDown={(e) =>
                                        handleKeyDownEnter(e, handleEditTask)
                                    }
                                />
                                {placeholder && (
                                    <span className="empty-alert">
                                        <CircleAlert size={15} />
                                        <span>{placeholder}</span>
                                    </span>
                                )}
                            </>
                        ) : (
                            <p className="truncate">{task}</p>
                        )}
                    </span>

                    <span className="flex-around w-20">
                        {openInputTask ? (
                            <>
                                <IconButton onClick={handleEditTask}>
                                    <Check size={15} />
                                </IconButton>
                                <IconButton
                                    onClick={() => setOpenInputTask(false)}
                                >
                                    <X size={15} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton onClick={handleEditClick}>
                                    <Pencil size={15} />
                                </IconButton>
                                <IconButton onClick={handleDeleteTask}>
                                    <Trash size={15} />
                                </IconButton>
                            </>
                        )}
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
}: {
    areaId: string;
    index: number;
    openInputTask: boolean;
    taskItem: TTask;
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

        dispatch(setTaskCompletion({ index, achieved: value[0] }));

        setOpenDialog(false);
        await updateTask(areaId, taskObj as TTask);
        // console.log("save", taskObj);
    };

    if (openInputTask) {
        return <span className="status-button bg-blue-400"></span>;
    } else {
        return (
            <CompletionDialog
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
                        onKeyDown={(e) => handleKeyDownEnter(e, handleClick)}
                    />
                    <span>{value}%</span>
                </div>
            </CompletionDialog>
        );
    }
}
