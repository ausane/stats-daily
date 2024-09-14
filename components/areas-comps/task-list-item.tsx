"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { TaskCompletionDialog, ValidationAlertDialog } from "../dialogs";
import { Slider } from "../ui/slider";
import { updateTask } from "@/lib/services/handle-update";
import IconButton from "../ui/icon-button";
import { deleteTask } from "@/lib/services/handle-delete";
import Input from "../ui/input";
import { handleKeyDownEnter, ntf } from "@/lib/utils";
import { Check, Pencil, Trash, X, Ellipsis } from "lucide-react";
import {
  TaskStatus,
  TaskContent,
  TaskOptions,
  InputRequiredAlert,
} from "./task-items";
import {
  InputChangeEvent,
  TaskListItemsProps,
  TaskOptionsUIProps,
  TaskStatusPCProps,
  TTask,
} from "@/lib/types";
import {
  setTaskCompletion,
  removeTaskById,
  setEditedTask,
} from "@/features/task-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export default function TaskListItem(props: TaskListItemsProps) {
  const { index, areaId, taskItem, oita, nfaf } = props;

  const task = taskItem.task;
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputTask, setInputTask] = useState(task);
  const [alertDialog, setAlertDialog] = useState(false);
  const [emptyInputAlert, setEmptyInputAlert] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (oita) inputRef.current?.focus();
  }, [oita]);

  const handleEditClick = () => {
    setEmptyInputAlert(false);
    nfaf(true, index);
    setInputTask(task);
  };

  const handleEditTask = async () => {
    if (!validateEditedTask()) return;

    dispatch(setEditedTask({ index, task: inputTask }));
    nfaf(false, index);

    const taskObj = { ...taskItem, task: inputTask };

    await updateTask(areaId, taskObj as TTask);
  };

  const validateEditedTask = () => {
    const editedTask = inputTask.trim();

    if (!editedTask) {
      setInputTask("");
      setEmptyInputAlert(true);
      return false;
    }

    if (editedTask.length > 40) {
      setAlertDialog(true);
      return false;
    }

    return true;
  };

  const handleEditInputChange = (event: InputChangeEvent) => {
    const { value } = event.target;
    setInputTask(value);
    setEmptyInputAlert(value ? false : true);
  };

  const handleDeleteTask = async () => {
    dispatch(removeTaskById(taskItem._id as string));
    await deleteTask(areaId, taskItem._id as string);
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const target = event.relatedTarget as HTMLElement;
    const nte = ["edit-button", "cancel-button", "okay-button"];

    if (!target || !nte.includes(target.id)) nfaf(false, index);
  };

  return (
    <>
      <ValidationAlertDialog
        category="task"
        alertDialog={alertDialog}
        setAlertDialog={setAlertDialog}
      />

      <div className="flex-between w-full">
        <>
          <TaskStatus>
            <TaskStatusPC
              index={index}
              areaId={areaId}
              openInputTask={oita}
              taskItem={taskItem}
            />
          </TaskStatus>

          <TaskContent>
            {oita ? (
              <>
                <Input
                  ref={inputRef}
                  type="text"
                  name="task"
                  labelClasses="w-5/6"
                  value={inputTask}
                  onChange={handleEditInputChange}
                  onKeyDown={(e) => handleKeyDownEnter(e, handleEditTask)}
                  onBlur={(e) => handleOnBlur(e)}
                />
                {emptyInputAlert && <InputRequiredAlert />}
              </>
            ) : (
              <p
                className="w-11/12 truncate"
                aria-live="polite"
                aria-relevant="additions"
              >
                {task}
              </p>
            )}
          </TaskContent>

          <TaskOptions>
            <TaskOptionsUI
              oita={oita}
              index={index}
              nfaf={nfaf}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              handleEditClick={handleEditClick}
            />
          </TaskOptions>
        </>
      </div>
    </>
  );
}

export function TaskStatusPC(props: TaskStatusPCProps) {
  const { areaId, index, openInputTask, taskItem } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useAppDispatch();

  // Ensure the state is typed as number[]
  const [value, setValue] = useState<number[]>([50]);

  const handleClick = async () => {
    const taskObj = ntf(taskItem, true, value[0]);

    dispatch(setTaskCompletion({ index, achieved: value[0] }));

    setOpenDialog(false);
    await updateTask(areaId, taskObj as TTask);
  };

  if (openInputTask) {
    return <span className="status-button border-blue-400 bg-blue-400"></span>;
  } else {
    return (
      <TaskCompletionDialog
        onClick={handleClick}
        task={taskItem.task}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      >
        <div className="flex-between w-full">
          <Slider
            className="w-4/5"
            min={1}
            max={100}
            step={1}
            value={value}
            onValueChange={(newValue) => setValue(newValue)}
            onKeyDown={(e) => handleKeyDownEnter(e, handleClick)}
          />
          <span>{value}%</span>
        </div>
      </TaskCompletionDialog>
    );
  }
}

export function TaskOptionsUI({
  oita,
  index,
  nfaf,
  handleEditTask,
  handleDeleteTask,
  handleEditClick,
}: TaskOptionsUIProps) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Function to update state with the current window width
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (oita) {
    return (
      <>
        <IconButton
          id="edit-button"
          className="max-sm:mr-2"
          onClick={handleEditTask}
          aria-label="Save Edited Task"
        >
          <Check size={15} />
        </IconButton>
        <IconButton
          className="max-sm:hidden"
          onClick={() => nfaf(false, index)}
          aria-label="Close Editing Task"
        >
          <X size={15} />
        </IconButton>
      </>
    );
  } else {
    if (windowWidth < 640) {
      return (
        <span className="flex-end w-full pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 p-0"
                aria-label="Task Options Button"
              >
                <Ellipsis size={15} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-24">
              <DropdownMenuItem onClick={handleEditClick} className="p-2">
                <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteTask} className="p-2">
                <Trash
                  className="mr-2 h-4 w-4 text-red-500"
                  aria-hidden="true"
                />
                <span className="text-red-500">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      );
    } else {
      return (
        <>
          <IconButton onClick={handleEditClick} aria-label="Edit Task">
            <Pencil size={15} />
          </IconButton>
          <IconButton onClick={handleDeleteTask} aria-label="Delete Task">
            <Trash size={15} />
          </IconButton>
        </>
      );
    }
  }
}
