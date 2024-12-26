"use client";

import { useEffect, useState } from "react";
import { format, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Cookies from "js-cookie";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [completedMessage, setCompletedMessage] = useState(false);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const defaultTargetDate = new Date(currentYear + 1, 0, 1);
    const savedTargetDate = Cookies.get("targetDate")
      ? new Date(Cookies.get("targetDate")!)
      : defaultTargetDate;

    if (!targetDate || targetDate.getTime() !== savedTargetDate.getTime()) {
      setTargetDate(savedTargetDate);
    }

    const timer = setInterval(() => {
      if (!targetDate) return;

      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setCompletedMessage(true);
        return;
      }

      setCompletedMessage(false);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSetTargetDate = (date: Date) => {
    if (date && (!targetDate || targetDate.getTime() !== date.getTime())) {
      const parsedDate = new Date(date);
      setTargetDate(parsedDate);
      Cookies.set("targetDate", parsedDate.toISOString(), { expires: 365 });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 py-6 font-mono text-green-500">
      {/* <div className="pointer-events-none fixed inset-0 grid min-h-screen grid-cols-12 grid-rows-12 opacity-5">
        {[...Array(144)].map((_, i) => (
          <div key={i} className="border border-green-500"></div>
        ))}
      </div> */}

      {completedMessage ? (
        <div className="text-center font-bold">
          <p className="block text-xl sm:text-2xl">
            {format(targetDate as Date, "PPP")}
          </p>
          <p className="mt-2 block text-3xl sm:mt-4 sm:text-5xl">
            Countdown Complete!
          </p>
        </div>
      ) : (
        <>
          <p className="mb-8 flex flex-col text-center text-3xl font-bold md:text-5xl">
            <span>Countdown to</span>
            <span>
              {targetDate ? format(targetDate, "PPP") : "your target date"}
            </span>
          </p>
          <div className="grid grid-cols-1 gap-6 text-center max-sm:w-full max-sm:px-6 sm:grid-cols-2 md:grid-cols-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="border border-green-500 bg-gray-800 p-8 shadow-lg"
              >
                <span className="block text-4xl font-bold tabular-nums">
                  {value.toString().padStart(2, "0")}
                </span>
                <span className="mt-2 block text-lg capitalize">{unit}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <DatePicker date={targetDate} onSelect={handleSetTargetDate} />
    </div>
  );
}

export function DatePicker({
  date,
  onSelect,
}: {
  date: Date | null;
  onSelect: (date: Date) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size="icon"
          className={cn("flex-center fixed bottom-4 right-4 rounded-full")}
        >
          <CalendarIcon className="h-4 w-4 text-green-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto items-center justify-center bg-gray-900 p-0 font-mono text-green-400 shadow-lg">
        <Calendar
          mode="single"
          selected={date as Date}
          onSelect={(e) => {
            onSelect(e as Date);
            setOpen(false);
          }}
          initialFocus
          disabled={(date) => isBefore(date, new Date())}
          classNames={{
            day_selected: "bg-green-500 text-gray-100",
            day_today: "bg-green-600 text-white",
            day: "h-9 w-9 rounded-none hover:bg-green-600 hover:text-gray-100",
            nav_button:
              "h-7 w-7 bg-gray-900 hover:bg-green-600 rounded-none hover:text-gray-100 flex-center",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
