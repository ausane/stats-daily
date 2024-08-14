import React from "react";
import { TooltipCompo } from "./tooltip";

export type CircularProgressProps = { progress: number; ctc: string };

const CircularProgress = ({ progress, ctc }: CircularProgressProps) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const validProgress =
        isNaN(progress) || progress < 0 ? 0 : progress > 100 ? 100 : progress;
    const offset = circumference - (validProgress / 100) * circumference;

    return (
        <div className="relative w-full h-2/5 flex-between">
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
                <TooltipCompo tip="Completed Tasks">
                    <div className="relative w-12 h-[108px] flex">
                        <div className="absolute h-full w-full bbn rounded-lg bg-secondary"></div>
                        <div
                            style={{ height: ctc }}
                            className={`absolute w-full bbn rounded-lg opacity-50 self-end ${
                                ctc === "100%" ? "bg-green-400" : "bg-primary"
                            }`}
                        ></div>
                        <div className="absolute h-full w-full flex-center">
                            <p className="text-primary rotate-[-90deg]">
                                {ctc}
                            </p>
                        </div>
                    </div>
                </TooltipCompo>
            </div>
        </div>
    );
};

export default CircularProgress;
