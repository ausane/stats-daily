"use client";

import { AddNewTaskProps, InputChangeEvent, TArea, TTask } from "@/lib/types";
import DailyNote from "./area/daily-note";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TaskListItem from "./task-list-item";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTask } from "@/lib/services/handle-update";
import {
  TaskStatus,
  TaskContent,
  TaskOptions,
  InputRequiredAlert,
} from "./task-items";
import CircularProgress, { progressCalculator } from "./area/progress";
import { createNewTask } from "@/lib/services/handle-update";
import IconButton from "../ui/icon-button";
import { ValidationAlertDialog } from "../dialogs";
import { TooltipCompo } from "../ui/tooltip";
import Input from "../ui/input";
import { handleKeyDownEnter, ntf, st } from "@/lib/utils";
import {
  ArrowUp,
  X,
  Check,
  Plus,
  Circle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  setIncompleteTasks,
  setCompleteTasks,
  undoTaskCompletion,
} from "@/features/task-slice";

export default function TaskList({ data }: { data: TArea }) {
  const { _id: areaId, tasks, note } = data;
  const dispatch = useAppDispatch();

  const [ctp, setCtp] = useState(0);
  const [progress, setProgress] = useState(0);
  const [addTaskInput, setAddTaskInput] = useState(false);

  const cdts = useMemo(
    () => tasks?.filter((task) => task.completed).sort(st),
    [tasks],
  );
  const icts = useMemo(
    () => tasks?.filter((task) => !task.completed).sort(st),
    [tasks],
  );

  useEffect(() => {
    dispatch(setCompleteTasks(cdts));
    dispatch(setIncompleteTasks(icts));
  }, [cdts, icts, dispatch]);

  // Tasks States
  const completedTasks = useAppSelector((state) => state.task.completedTasks);
  const incompleteTasks = useAppSelector((state) => state.task.incompleteTasks);

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
      setCtp,
    );

    // Cleanup the interval on component unmount
    return () => cleanup();
  }, [completedTasks, incompleteTasks.length]);

  return (
    <div className="flex-between box-border size-full grow gap-4 overflow-hidden">
      <div className="bbn relative box-border h-full w-8/12 overflow-auto rounded-lg max-lg:w-full">
        <div className="flex-between sticky top-0 box-border h-12 w-full border-b px-2 pr-4">
          <span
            className="flex-center w-12 text-muted-foreground"
            aria-hidden="true"
          >
            <Circle />
          </span>
          <p className="flex-center h-full font-medium text-muted-foreground">
            {incompleteTasks.length === 0
              ? "No Incomplete"
              : `${incompleteTasks.length} Incomplete`}{" "}
            {incompleteTasks.length === 1 ? "Task" : "Tasks"}
          </p>
          <TooltipCompo tip={`${addTaskInput ? "Close" : "Add Task"}`}>
            <IconButton
              id="cancel-button"
              variant="ghost"
              circle={true}
              className={`duration-400 p-0 transition-transform ease-in-out ${
                addTaskInput ? "rotate-45" : "rotate-90"
              }`}
              onClick={() => {
                setOita(dfa);
                setAddTaskInput(!addTaskInput);
              }}
              aria-label={`${addTaskInput ? "Close adding task" : "Add new task"}`}
            >
              <Plus />
            </IconButton>
          </TooltipCompo>
        </div>

        <div className="h-[calc(100%-6rem)] w-full overflow-auto overflow-x-hidden">
          <AddNewTask
            areaId={areaId as string}
            addTaskInput={addTaskInput}
            setAddTaskInput={setAddTaskInput}
          />
          {incompleteTasks?.map((item, index) => (
            <div key={index} className="w-full border-b p-2">
              <TaskListItem
                oita={oita[index]}
                nfaf={nfaf}
                areaId={areaId as string}
                taskItem={item}
                index={index}
              />
            </div>
          ))}
        </div>
        <ShowCompletedTasks
          areaId={areaId as string}
          completedTasks={completedTasks}
        />
      </div>
      <div className="flex h-full w-1/3 flex-col gap-4 max-lg:flex max-lg:hidden max-md:flex max-sm:hidden">
        <CircularProgress progress={progress} ctp={ctp} />
        <div className="bbn box-border h-[calc(100%-10rem)] rounded-lg px-4 py-2">
          <DailyNote areaId={areaId as string} note={note as string} />
        </div>
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
      className={`duration-400 absolute bottom-0 left-0 w-full overflow-hidden bg-background transition-all ease-in-out ${open ? "h-full" : "h-12 border-t"}`}
    >
      <div className="flex-between sticky left-0 top-0 h-12 w-full border-b px-2 pr-4">
        <span
          className="flex-center w-12 text-muted-foreground"
          aria-hidden="true"
        >
          <CheckCircle2 />
        </span>
        <p className="flex-center h-full font-medium text-muted-foreground">
          {completedTasks.length === 0
            ? "No Completed"
            : `${completedTasks.length} Completed`}{" "}
          {completedTasks.length === 1 ? "Task" : "Tasks"}
        </p>
        <TooltipCompo tip={`${open ? "Close" : "Open"}`}>
          <IconButton
            variant="ghost"
            circle={true}
            className={`duration-400 p-0 transition-transform ease-in-out ${open ? "rotate-180" : "rotate-0"}`}
            onClick={() => setOpen(!open)}
            aria-label={`${open ? "Close completed tasks tab" : "Open completed tasks tab"}`}
          >
            <ArrowUp />
          </IconButton>
        </TooltipCompo>
      </div>
      <div
        className={`h-[calc(100%-3rem)] flex-col overflow-auto ${open ? "flex" : "hidden"} `}
      >
        {completedTasks?.map((item, index) => (
          <div key={index} className="flex-between w-full border-b px-2 py-3">
            <TaskStatus>
              <button
                onClick={() => handleUndoTask(index)}
                className="status-button border-red-700 bg-red-700 hover:bg-red-800"
                aria-label="Undo Task"
              ></button>
            </TaskStatus>

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
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    if (addTaskInput) {
      setNewTaskValue("");
      setLoadingMessage("");
      setEmptyInputAlert(false);
      inputRef.current?.focus();
    }
  }, [addTaskInput]);

  const dispatch = useAppDispatch();

  const addNewTask = async () => {
    if (!validateNewTask()) return;

    setLoading(true);
    setLoadingMessage("Saving New Task");

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
      <div className="flex-between border-b p-2">
        <ValidationAlertDialog
          category="task"
          alertDialog={alertDialog}
          setAlertDialog={setAlertDialog}
        />

        <TaskStatus>
          <span className="status-button border-green-400 bg-green-400"></span>
        </TaskStatus>

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
            aria-label="Add new task input"
            aria-invalid={emptyInputAlert}
            aria-required="true"
          />
          {emptyInputAlert && <InputRequiredAlert />}
        </TaskContent>

        <TaskOptions>
          <span
            role="status"
            aria-live="assertive"
            className="absolute left-[-9999px]"
          >
            {loadingMessage}
          </span>
          {loading ? (
            <Loader2 className="animate-spin max-sm:mr-2" aria-hidden="true" />
          ) : (
            <>
              <IconButton
                id="submit-button"
                variant="default"
                onClick={addNewTask}
                className="max-sm:mr-2"
                aria-label="Save New Task"
              >
                <Check size={15} />
              </IconButton>
              <IconButton
                variant="default"
                onClick={() => {
                  setAddTaskInput(false);
                  setNewTaskValue("");
                }}
                className="max-sm:hidden"
                aria-label="Close Adding Task"
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
