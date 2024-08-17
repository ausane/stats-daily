"use client";

import { AddNewTaskProps, InputChangeEvent, TStat, TTask } from "@/lib/types";
import DailyNote from "./area/daily-note";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TaskListItem from "./task-list-item";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTask } from "@/lib/utils/handle-update";
import { TaskState, TaskContent, TaskOptions } from "../task-items";
import CircularProgress, { progressCalculator } from "../ui/circular-progress";
import { createNewTask } from "@/lib/utils/handle-update";
import IconButton from "../ui/icon-button";
import { ValidationAlertDialog } from "../confirm-dialog";
import { TooltipCompo } from "../ui/tooltip";
import Input from "../ui/input";
import { handleKeyDownEnter, ntf, st } from "@/lib/constants";
import {
    ArrowUp,
    X,
    Check,
    Plus,
    CircleAlert,
    Circle,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import {
    setIncompleteTasks,
    setCompleteTasks,
    undoTaskCompletion,
} from "@/features/task-slice";

export default function TaskList({ data }: { data: TStat }) {
    const { _id, tasks, note } = data;

    const [ctp, setCtp] = useState(0);
    const [progress, setProgress] = useState(0);
    const [addTaskInput, setAddTaskInput] = useState(false);

    const cdts = useMemo(
        () => tasks?.filter((task) => task.completed === true).sort(st),
        [tasks]
    );
    const icts = useMemo(
        () => tasks?.filter((task) => task.completed === false).sort(st),
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

    // To handle each task's input state
    const dfa = Array(incompleteTasks.length).fill(false);
    const [oita, setOita] = useState(dfa); // Input task array state

    const nfaf = (s: boolean, i: number) => {
        setAddTaskInput(false);
        const updatedState = [...dfa];
        updatedState[i] = s;
        setOita(updatedState);
    };

    // Progress Animation
    useEffect(() => {
        const total = completedTasks.length + incompleteTasks.length;
        if (!total) return;

        const cleanup = progressCalculator(
            total,
            completedTasks,
            setProgress,
            setCtp
        );

        // Cleanup the interval on component unmount
        return () => cleanup();
    }, [completedTasks, incompleteTasks.length]);

    return (
        <div className="size-full grow overflow-auto box-border flex-between gap-4">
            <div className="w-8/12 h-full overflow-auto box-border bbn rounded-md relative max-lg:w-full">
                <div className="w-full h-10 flex-between sticky top-0 border-b px-2 pr-4 box-border">
                    <span className="w-12 flex-center opacity-50">
                        <Circle />
                    </span>
                    <p className="h-full flex-center font-medium opacity-50">
                        {incompleteTasks.length === 0
                            ? "No Incomplete"
                            : `${incompleteTasks.length} Incomplete`}
                        {incompleteTasks.length === 1 ? " Task" : " Tasks"}
                    </p>
                    <TooltipCompo
                        tip={`${addTaskInput ? "Close" : "Add Task"}`}
                    >
                        <IconButton
                            id="cancel-button"
                            variant="ghost"
                            circle={true}
                            className={`transition-transform duration-400 ease-in-out p-0 ${
                                addTaskInput ? "rotate-45" : "rotate-90"
                            }`}
                            onClick={() => {
                                setOita(dfa);
                                setAddTaskInput(!addTaskInput);
                            }}
                        >
                            <Plus />
                        </IconButton>
                    </TooltipCompo>
                </div>

                <div className="w-full h-[calc(100%-5rem)] overflow-auto overflow-x-hidden">
                    <AddNewTask
                        areaId={_id as string}
                        addTaskInput={addTaskInput}
                        setAddTaskInput={setAddTaskInput}
                    />
                    {incompleteTasks?.map((item, index) => (
                        <div key={index} className="w-full border-b p-2">
                            <TaskListItem
                                oita={oita[index]}
                                nfaf={nfaf}
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
            <div className="w-1/3 h-full flex max-sm:hidden max-lg:hidden max-lg:flex max-md:flex flex-col gap-4">
                <CircularProgress progress={progress} ctp={ctp} />
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
        const task = ntf(completedTasks[index], false, 0);
        dispatch(undoTaskCompletion(index));

        if (completedTasks.length === 1) setOpen(false);

        await updateTask(areaId, task as TTask);
    };

    return (
        <div
            className={`border-t w-full absolute bottom-0 left-0 bg-background transition-all duration-400 ease-in-out overflow-hidden 
                ${open ? "h-full" : "h-10"}`}
        >
            <div className="w-full h-10 sticky top-0 left-0 border-b flex-between px-2 pr-4">
                <span className="w-12 flex-center opacity-50">
                    <CheckCircle2 />
                </span>
                <p className="h-full flex-center font-medium opacity-50">
                    {completedTasks.length === 0
                        ? "No Completed"
                        : `${completedTasks.length} Completed`}
                    {completedTasks.length === 1 ? " Task" : " Tasks"}
                </p>
                <TooltipCompo tip={`${open ? "Close" : "Open"}`}>
                    <IconButton
                        variant="ghost"
                        circle={true}
                        className={`transition-transform duration-400 ease-in-out p-0 ${
                            open ? "rotate-180" : "rotate-0"
                        }`}
                        onClick={() => setOpen(!open)}
                    >
                        <ArrowUp />
                    </IconButton>
                </TooltipCompo>
            </div>
            <div
                className={`h-[calc(100%-2.5rem)] flex-col overflow-auto 
                    ${open ? "flex" : "hidden"} `}
            >
                {completedTasks?.map((item, index) => (
                    <div key={index} className="w-full flex-between bbn p-2">
                        <TaskState>
                            <button
                                onClick={() => handleUndoTask(index)}
                                className="status-button bg-red-700 hover:bg-red-800"
                            ></button>
                        </TaskState>

                        <TaskContent>
                            <p className="w-11/12 truncate">{item.task}</p>
                        </TaskContent>

                        <TaskOptions>
                            <p>{item.achieved.toString()}%</p>
                        </TaskOptions>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AddNewTask(props: AddNewTaskProps) {
    const { areaId, addTaskInput, setAddTaskInput } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [newTaskValue, setNewTaskValue] = useState("");
    const [alertDialog, setAlertDialog] = useState(false);
    const [emptyInputAlert, setEmptyInputAlert] = useState(false);

    useEffect(() => {
        if (addTaskInput) {
            setNewTaskValue("");
            setEmptyInputAlert(false);
            inputRef.current?.focus();
        }
    }, [addTaskInput]);

    const dispatch = useAppDispatch();

    const addNewTask = async () => {
        setLoading(true);
        if (!validateNewTask()) return;

        const newTaskInput = ntf(newTaskValue, false, 0);
        const { newTasks } = await createNewTask(areaId, newTaskInput);

        dispatch(setIncompleteTasks(newTasks));

        setAddTaskInput(false);
        setNewTaskValue("");
        setLoading(false);
    };

    const validateNewTask = () => {
        const newTask = newTaskValue.trim();

        if (!newTask) {
            setNewTaskValue("");
            setEmptyInputAlert(true);
            setLoading(false);
            return false;
        }

        if (newTask.length > 40) {
            setAlertDialog(true);
            setLoading(false);
            return false;
        }

        return true;
    };

    const handleNewTaskInputChange = (event: InputChangeEvent) => {
        const { value } = event.target;
        setNewTaskValue(value);
        setEmptyInputAlert(value ? false : true);
    };

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const target = event.relatedTarget as HTMLElement;
        const nte = ["submit-button", "cancel-button", "okay-button"];

        if (!target || !nte.includes(target.id)) setAddTaskInput(false);
    };

    if (addTaskInput) {
        return (
            <div className="p-2 flex-between border-b">
                <ValidationAlertDialog
                    category="task"
                    alertDialog={alertDialog}
                    setAlertDialog={setAlertDialog}
                />

                <TaskState>
                    <span className="status-button bg-green-400"></span>
                </TaskState>

                <TaskContent>
                    <Input
                        ref={inputRef}
                        type="text"
                        name="task"
                        labelClasses="w-5/6"
                        value={newTaskValue}
                        onChange={handleNewTaskInputChange}
                        onKeyDown={(e) => handleKeyDownEnter(e, addNewTask)}
                        onBlur={(e) => handleOnBlur(e)}
                    />
                    {emptyInputAlert && (
                        <span className="empty-alert">
                            <CircleAlert size={15} />
                            <span>Task cannot be empty!</span>
                        </span>
                    )}
                </TaskContent>

                <TaskOptions>
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            <IconButton
                                id="submit-button"
                                variant="default"
                                onClick={addNewTask}
                            >
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
                        </>
                    )}
                </TaskOptions>
            </div>
        );
    }
}
