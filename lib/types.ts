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

// Helper type to omit Document from nested types
export type OmitDocument<T> = Omit<T, keyof Document>;

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
export type requestJsonData = {
    id: string;
    taskId: string;
    task: TTask;
    note: string;
    area: string;
};
