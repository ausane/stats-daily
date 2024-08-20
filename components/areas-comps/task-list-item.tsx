"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { TaskCompletionDialog, ValidationAlertDialog } from "../confirm-dialog";
import { Slider } from "../ui/slider";
import { updateTask } from "@/lib/utils/handle-update";
import IconButton from "../ui/icon-button";
import { deleteTask } from "@/lib/utils/handle-delete";
import Input from "../ui/input";
import { handleKeyDownEnter, ntf } from "@/lib/constants";
import { Check, Pencil, Trash, X } from "lucide-react";
import {
  TaskState,
  TaskContent,
  TaskOptions,
  InputRequiredAlert,
} from "../task-items";
import {
  InputChangeEvent,
  TaskListItemsProps,
  TaskStatusProps,
  TTask,
} from "@/lib/types";
import {
  setTaskCompletion,
  removeTaskById,
  setEditedTask,
} from "@/features/task-slice";

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
          <TaskState>
            <TaskStatus
              index={index}
              areaId={areaId}
              openInputTask={oita}
              taskItem={taskItem}
            />
          </TaskState>

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
              <p className="w-11/12 truncate">{task}</p>
            )}
          </TaskContent>

          <TaskOptions>
            {oita ? (
              <>
                <IconButton id="edit-button" onClick={handleEditTask}>
                  <Check size={15} />
                </IconButton>
                <IconButton onClick={() => nfaf(false, index)}>
                  <X size={15} />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={handleEditClick}>
                  <Pencil size={15} />
                </IconButton>
                <IconButton onClick={handleDeleteTask}>
                  <Trash size={15} />
                </IconButton>
              </>
            )}
          </TaskOptions>
        </>
      </div>
    </>
  );
}

export function TaskStatus(props: TaskStatusProps) {
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
    return <span className="status-button bg-blue-400"></span>;
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
            // defaultValue={[80]}
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
