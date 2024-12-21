"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function YearCountdown({
  targetDate: initialTargetDate,
}: {
  targetDate?: string;
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [targetDate, setTargetDate] = useState<string | null>(null);

  useEffect(() => {
    const savedTargetDate = Cookies.get("targetDate") || initialTargetDate;
    setTargetDate(savedTargetDate as string);

    const timer = setInterval(() => {
      if (!savedTargetDate) return;

      const now = new Date();
      const target = new Date(savedTargetDate);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTargetDate, targetDate]);

  const handleSetTargetDate = () => {
    const userInput = prompt("Enter your target date (YYYY-MM-DD):");
    if (userInput) {
      const parsedDate = new Date(userInput);
      if (!isNaN(parsedDate.getTime())) {
        const isoDate = parsedDate.toISOString();
        setTargetDate(isoDate);
        Cookies.set("targetDate", isoDate, { expires: 365 });
      } else {
        alert("Invalid date format. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 font-mono text-green-400">
      <div className="pointer-events-none absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5">
        {[...Array(144)].map((_, i) => (
          <div key={i} className="border border-green-500"></div>
        ))}
      </div>
      <h1 className="mb-8 text-center text-3xl font-bold md:text-5xl">
        Countdown to{" "}
        {targetDate
          ? new Date(targetDate).toLocaleDateString()
          : "your target date"}
      </h1>
      <div className="grid grid-cols-1 gap-6 text-center max-sm:w-full max-sm:px-8 sm:grid-cols-2 md:grid-cols-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className="border border-green-500 bg-gray-800 p-8 shadow-lg"
          >
            <span className="block text-4xl font-bold tabular-nums">
              {value.toString().padStart(2, "0")}
            </span>
            <span className="mt-2 block text-lg capitalize text-green-300">
              {unit}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={handleSetTargetDate}
        className="absolute bottom-4 right-4 rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Set
      </button>
    </div>
  );
}
