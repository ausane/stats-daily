"use client";

import { useState, useRef } from "react";
// import IconButton from "@/components/icon-button";
// import { IconButton } from "@/components/ui/icon-button";

export default function TasksHeader({
    handleAddTaskButtonClick,
}: {
    handleAddTaskButtonClick: () => void;
}) {
    const [inputNewTask, setInputNewTask] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    const addNewTask = () => {
        console.log("task");
    };

    return (
        <>
            <div className="w-full flex-between tasks-header sticky top-0 font-bold bg-black border-b">
                <span className="flex-start">Task</span>
                <span>Target</span>
                <span>Achieved</span>
                <span>Unit</span>
                <span>
                    <button onClick={handleAddTaskButtonClick}>New Task</button>
                </span>
            </div>
            {inputNewTask && (
                <div className="flex-between">
                    <span className="flex-around">
                        {/* <IconButton
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
                        /> */}
                    </span>
                </div>
            )}
        </>
    );
}
