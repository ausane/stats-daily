"use client";

import { TStat, TTask } from "@/lib/types";
import DailyNote from "./area/daily-note";
import { useEffect, useRef, useState } from "react";
import TaskLists from "./tasklist";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTask } from "@/lib/utils/handle-update";
import { ArrowUpCircleIcon, ArrowUp } from "lucide-react";
import CircularProgress from "../ui/circular-progress";
import {
    setIncompleteTasks,
    setCompleteTasks,
    undoTaskCompletion,
    // setCheckedStatus,
} from "@/features/taskSlice";
import IconButton from "../ui/icon-button";

export default function TaskList({ data }: { data: TStat }) {
    const { _id, tasks, note } = data;

    const [progress, setProgress] = useState(0);

    const dispatch = useAppDispatch();

    const icts = tasks?.filter((task) => task.completed === false);
    const cdts = tasks?.filter((task) => task.completed === true);
    // const status = tasks?.map((task) => task.completed);
    // console.log(status);
    // const [incompleteTasks, setIncompleteTasks] = useState<TTask[]>([]);
    // const [completedTasks, setCompleteTasks] = useState<TTask[]>([]);

    // console.log(incompleteTasks);

    useEffect(() => {
        dispatch(setCompleteTasks(cdts));
        dispatch(setIncompleteTasks(icts));
        // dispatch(setCheckedStatus(status));
    }, [tasks]);

    const incompleteTasks = useAppSelector(
        (state) => state.task.incompleteTasks
    );

    const completedTasks = useAppSelector((state) => state.task.completedTasks);

    const calculateProgress = () => {
        if (!completedTasks.length) return 0;
        const achievedArray = completedTasks.map((item) => item.achieved);

        const total = achievedArray.reduce((sum, number) => sum + number, 0);
        return parseInt((total / achievedArray.length).toFixed(), 10);
    };

    // console.log(calculateProgress());

    useEffect(() => {
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
            <div className="w-8/12 h-full overflow-auto box-border bbn rounded-md max-md:w-full relative">
                <div className="w-full h-10 flex-between sticky top-0 font-bold border-b p-2 box-border bg-secondary">
                    <span className="w-1/6 flex-center">Status</span>
                    <span className="w-4/6 flex-start">Task</span>
                    <span className="w-1/6 flex-start mr-2">
                        <button>AddNew</button>
                    </span>
                </div>

                <div className="w-full h-[calc(100%-5rem)] overflow-auto">
                    {incompleteTasks?.map((item, index) => (
                        <div
                            key={index}
                            className="w-full flex flex-col bbn p-2"
                        >
                            <TaskLists
                                areaId={_id as string}
                                taskItem={item}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
                <ShowCompletedTasks
                    _id={_id as string}
                    completedTasks={completedTasks}
                />
            </div>
            <div className="w-4/12 h-full max-md:hidden">
                <CircularProgress progress={progress} />
                <DailyNote id={_id as string} note={note as string} />
            </div>
        </div>
    );
}

export function ShowCompletedTasks({
    _id,
    completedTasks,
}: {
    _id: string;
    completedTasks: TTask[];
}) {
    // const divRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const dispatch = useAppDispatch();
    // const completedTasks = useAppSelector((state) => state.task.completedTasks);

    const handleUndoTask = async (index: number) => {
        const task = {
            ...completedTasks[index],
            completed: false,
            achieved: 0,
        };

        dispatch(undoTaskCompletion(index));

        await updateTask(_id, task as TTask);
    };

    return (
        <div
            className={`border-t w-full absolute bottom-0 left-0 bg-background transition-all duration-400 ease-in-out overflow-hidden 
                ${open ? "h-[calc(100%-0rem)]" : "h-10"}`}
        >
            {/* <div className="relative h-8"> */}
            <div className="w-full h-10 bg-secondary sticky top-0 left-0 border-b flex-between px-4">
                <p className="h-full flex-center font-bold">Done Tasks</p>
                <IconButton
                    variant="ghost"
                    circle={true}
                    className={`transition-transform duration-400 ease-in-out hover:bg-background ${
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
                                className="w-4 h-4 bbn rounded-full p-0 bg-red-700 hover:bg-red-800"
                            ></button>
                            {/* <button onClick={() => click(index)}>click</button> */}
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
            {/* </div> */}
        </div>
    );
}
