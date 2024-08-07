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

// Helper type to omit Document from nested type
export type OmitDocument<T> = Omit<T, keyof Document>;
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// Form Slice InitialState Type
export type InitialState = {
    area: string;
    note: string;
    task: string;
    tasks: OmitDocument<TTask>[];
    errMsg: string;
};

// Apply OmitDocument to both TStat and TTask
export type StatsWithoutDocument = {
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

// Sidebar Toggler Props Type
export type SidebarTogglerProps = {
    tasks: TSC[];
    areaId: string;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
};

// Rename Area Dialog Props Type
export type RenameAreaDialogProps = {
    onClick: () => void;
    renameDialog: boolean;
    setRenameDialog: SetState<boolean>;
    children: React.ReactNode;
};
