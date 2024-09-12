"use client";

import { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { X, CircleAlert } from "lucide-react";
import Input from "@/components/ui/input";
import IconButton from "@/components/ui/icon-button";
import { InputChangeEvent } from "@/lib/types";
import { handleKeyDownEnter } from "@/lib/utils";
import {
  handleTaskChange,
  addToTasks,
  handleEmptyTasks,
  removeTask,
} from "@/features/form-slice";

export default function CreateTasks() {
  // Retrieve all required states from the store
  const task = useAppSelector((state) => state.form.task);
  const tasks = useAppSelector((state) => state.form.tasks);
  const etem = useAppSelector((state) => state.form.etem);

  // Initialize all useRef elements
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize all useState elements
  const [taskError, setTaskError] = useState("");

  // Initialize dispatch function
  const dispatch = useAppDispatch();

  // Input Change Event Handler
  const handleTaskInputChange = (event: InputChangeEvent) => {
    dispatch(handleTaskChange(event.target.value));
    setTaskError("");
  };

  // Submit Task Handler Function
  const submitTask = () => {
    const trimmedTask = task.trim();

    if (trimmedTask.length > 40) {
      setTaskError("Only 40 characters allowed!");
      return;
    }

    if (trimmedTask) {
      dispatch(addToTasks());
      dispatch(handleEmptyTasks(""));

      inputRef.current?.focus();
    } else {
      dispatch(handleTaskChange(""));
      setTaskError("Task cannot be empty!");
    }
  };

  return (
    <div className="h-full w-3/5 border-l max-sm:w-full max-sm:border-0">
      <div
        className={`flex w-full flex-col gap-2 border-b p-4 ${
          taskError ? "h-32" : "h-24"
        }`}
      >
        <span className="relative flex w-full gap-2 max-sm:gap-4">
          <Input
            label="Task"
            ref={inputRef}
            type="text"
            name="task"
            value={task}
            onChange={handleTaskInputChange}
            onKeyDown={(e) => handleKeyDownEnter(e, submitTask)}
            className="mt-1 h-10 w-full rounded-md"
            labelClasses="w-full"
            role="textbox"
            aria-required="false"
            aria-invalid={!!taskError}
            // required
          />
          <Button
            type="button"
            className="self-end"
            onClick={submitTask}
            role="button"
            aria-label="Add Task"
          >
            Add
          </Button>
        </span>
        {taskError && (
          <span
            role="alert"
            aria-live="assertive"
            className="flex-center gap-1 self-start text-sm text-[#f93a37] opacity-80"
          >
            <CircleAlert size={15} aria-hidden="true" />
            <span>{taskError}</span>
          </span>
        )}
      </div>

      <div
        className={`overflow-auto py-2 ${
          taskError ? "h-[calc(100%-8rem)]" : "h-[calc(100%-6rem)]"
        }`}
      >
        {!tasks.length && (
          <div className="flex-center relative h-full w-full opacity-80 max-sm:p-4">
            {etem ? (
              <span
                role="alert"
                aria-live="assertive"
                className="flex-center h-full w-full gap-1 text-[#f93a37]"
              >
                <CircleAlert size={15} aria-hidden="true" />
                <span>{etem}</span>
              </span>
            ) : (
              <p>Your tasks will appear here</p>
            )}
          </div>
        )}
        {tasks.map((item, index) => (
          <div key={index} className="flex-between px-4 py-2">
            <span className="flex-start w-5/6 gap-4">
              <span className="bbn flex-center h-8 w-8 rounded-md">
                {index + 1}
              </span>
              <p className="w-[calc(100%-3rem)] truncate">{item.task}</p>
            </span>

            <IconButton
              type="button"
              variant="ghost"
              className="rounded-full"
              onClick={() => dispatch(removeTask(index))}
              aria-label="Remove Task"
            >
              <X size={15} />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
