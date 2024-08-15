import { Document } from "mongoose";
import { ImageProps } from "next/image";
import React, { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

// Stats Schema Type
export type TStats = {
    date: Date;
    note?: string;
    stats: TStat[];
} & Document;

// Stat Schema Type
export type TStat = {
    userId: string;
    area: string;
    note?: string;
    tasks: TTask[];
} & Document;

// Task Schema Type
export type TTask = {
    task: string;
    achieved: number;
    completed: boolean;
} & Document;

// TSC Type
export type TSC = {
    _id: string;
    area: string;
};

// Input Props Type
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    labelClasses?: string;
    children?: React.ReactNode;
};

// TaskInput Props Type
export type TaskInputProps = InputProps & {
    className?: string;
    inputAttributes: InputProps[];
    submitBtn?: React.RefObject<HTMLButtonElement>;
};

// Generic React utilities for state, events, and type handling
export type OmitDocument<T> = Omit<T, keyof Document>;
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type ChangeEvent<T> = React.ChangeEvent<T>;

// Form Slice InitialState Type
export type InitialState = {
    area: string;
    note: string;
    task: string;
    tasks: OmitDocument<TTask>[];
    etem: string;
};

// Apply OmitDocument to both TStat and TTask
export type StatsWithoutDocument = {
    userId: string;
    area: string;
    note?: string;
    tasks: OmitDocument<TTask>[];
};

// AreaRef Object Type
export type AreaRef = {
    _id: string;
    el: HTMLDivElement | null;
};

// Button Props Type
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    variant: string;
};

// IconButton Props Type
export type IconButtonProps = ButtonProps & ImageProps;

// API PATCH Route Type
export type RequestJsonData = {
    id: string;
    taskId: string;
    task: TTask;
    note: string;
    area: string;
};

// Dialog Props Type
export type CompletionDialogProps = {
    task: string;
    children: React.ReactNode;
    onClick: () => void;
    openDialog: boolean;
    setOpenDialog: SetState<boolean>;
};

// Confirm Dialog Props Type
export type ConfirmDialogProps = {
    deleteDialog: boolean;
    setDeleteDialog: SetState<boolean>;
    onClick: () => void;
};

// Add New Task Props Type
export type AddNewTaskProps = {
    areaId: string;
    addTaskInput: boolean;
    emptyInputAlert: boolean;
    setAddTaskInput: SetState<boolean>;
    setEmptyInputAlert: SetState<boolean>;
};

// Task Item Props Type
export type TaskItemCompoProps = {
    areaId: string;
    areaName: string;
    openRenameAreaDialog: () => void;
};

// Rename Area Dialog Props Type
export type RenameAreaDialogProps = {
    onClick: () => void;
    dialog: boolean;
    updating: boolean;
    openDialog: SetState<boolean>;
    children: React.ReactNode;
};

// Task Status Props Type
export type TaskStatusProps = {
    areaId: string;
    index: number;
    openInputTask: boolean;
    taskItem: TTask;
};

// Task List Items Props Type
export type TaskListItemsProps = {
    index: number;
    areaId: string;
    taskItem: TTask;
    oita: boolean;
    nfaf: (s: boolean, i: number) => void;
};

// Validation Alert Dialog Props Type
export type ValidationAlertDialogProps = {
    category: "note" | "task";
    alertDialog: boolean;
    setAlertDialog: SetState<boolean>;
};
