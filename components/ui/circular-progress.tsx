import React from "react";

const CircularProgress = ({ progress }: { progress: number }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const validProgress =
        isNaN(progress) || progress < 0 ? 0 : progress > 100 ? 100 : progress;
    const offset = circumference - (validProgress / 100) * circumference;

    return (
        <div className="relative w-full h-1/2 flex-center">
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
                    className="text-primary opacity-50"
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
            <div className="absolute inset-0 flex-center">{validProgress}%</div>
        </div>
    );
};

export default CircularProgress;
