import React from "react";
import { TooltipCompo } from "@/components/ui/tooltip";
import { SetState, TTask } from "@/lib/types";

export type CircularProgressProps = { progress: number; ctp: number };

export default function CircularProgress(props: CircularProgressProps) {
  const { progress, ctp } = props;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const validProgress = Math.max(0, Math.min(progress, 100));
  const offset = circumference * (1 - validProgress / 100);

  return (
    <div className="flex-between relative h-36 w-full gap-4">
      <TooltipCompo tip="Performance">
        <div
          className="bbn flex-center relative h-full w-3/5 rounded-md"
          role="progressbar"
          aria-label="Performance in the area"
          aria-valuenow={validProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
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
          <div className="flex-center absolute inset-0">{validProgress}%</div>
        </div>
      </TooltipCompo>

      <div
        className="bbn flex-center h-full w-2/5 rounded-md"
        role="progressbar"
        aria-label="Tasks completed"
        aria-valuenow={ctp || 0}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <TooltipCompo tip="Tasks Completed">
          <div className="relative flex h-[108px] w-12">
            <div className="absolute h-full w-full rounded-lg bg-secondary"></div>
            <div
              style={{ height: `${ctp ? ctp : 0}%` }}
              className={`absolute w-full self-end rounded-lg opacity-50 ${
                ctp === 100 ? "bg-green-400" : "bg-primary"
              }`}
            ></div>
            <div className="flex-center absolute h-full w-full">
              <p className="rotate-[-90deg] text-primary">{ctp ? ctp : 0}%</p>
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
  setCtp: SetState<number>,
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
