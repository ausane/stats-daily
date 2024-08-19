import React from "react";
import { TooltipCompo } from "./tooltip";
import { SetState, TTask } from "@/lib/types";

export type CircularProgressProps = { progress: number; ctp: number };

export default function CircularProgress(props: CircularProgressProps) {
    const { progress, ctp } = props;

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const validProgress = Math.max(0, Math.min(progress, 100));
    const offset = circumference * (1 - validProgress / 100);

    return (
        <div className="relative w-full h-2/5 flex-between bbn rounded-md">
            <TooltipCompo tip="Progress">
                <div className="relative w-3/5 flex-center">
                    <svg className="rotate-[-90deg]">
                        <circle
                            className="text-secondary"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50%"
                            cy="50%"
                        />
                        <circle
                            className={`opacity-50 ${
                                offset === 0 ? "text-green-400" : "text-primary"
                            }`}
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={isNaN(offset) ? 0 : offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50%"
                            cy="50%"
                        />
                    </svg>
                    <div className="absolute inset-0 flex-center">
                        {validProgress}%
                    </div>
                </div>
            </TooltipCompo>
            <div className="w-2/5 h-full p-4 flex-center">
                <TooltipCompo tip="Tasks Completed">
                    <div className="relative w-12 h-[108px] flex">
                        <div className="absolute h-full w-full bbn rounded-lg bg-secondary"></div>
                        <div
                            style={{ height: `${ctp ? ctp : 0}%` }}
                            className={`absolute w-full bbn rounded-lg opacity-50 self-end ${
                                ctp === 100 ? "bg-green-400" : "bg-primary"
                            }`}
                        ></div>
                        <div className="absolute h-full w-full flex-center">
                            <p className="text-primary rotate-[-90deg]">
                                {ctp ? ctp : 0}%
                            </p>
                        </div>
                    </div>
                </TooltipCompo>
            </div>
        </div>
    );
}

// To calculate the progress
export function progressCalculator(
    total: number,
    completedTasks: TTask[],
    setProgress: SetState<number>,
    setCtp: SetState<number>
) {
    const ctp = (100 * completedTasks.length) / total;
    const totalCtp = Math.floor(ctp);

    const achievedArray = completedTasks.map((item) => item.achieved);
    const totalAchieved = achievedArray.reduce((sum, num) => sum + num, 0);
    const totalProgress = Math.floor(totalAchieved / total);

    let currentProgress = 0;
    let currentCtp = 0;
    const incrementProgress = totalProgress / 100;
    const incrementCtp = totalCtp / 100;

    const interval = setInterval(() => {
        currentProgress += incrementProgress;
        currentCtp += incrementCtp;

        if (currentCtp >= totalCtp) currentCtp = totalCtp;
        if (currentProgress >= totalProgress) currentProgress = totalProgress;

        setProgress(Math.floor(currentProgress));
        setCtp(Math.floor(currentCtp));

        if (currentProgress === totalProgress && currentCtp === totalCtp) {
            clearInterval(interval);
        }
    }, 10); // Adjust the timing to control the speed of animation

    return () => clearInterval(interval);
}
