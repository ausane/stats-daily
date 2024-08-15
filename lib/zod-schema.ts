import { z } from "zod";

// Define schema for `area`
export const areaNameZodSchema = z
    .string()
    .trim()
    .min(1, "Area cannot be empty!")
    .max(20, "Area cannot exceed 20 characters!");

// Define schema for `note`
export const noteZodSchema = z
    .string()
    .trim()
    .max(400, "Area note cannot exceed 400 characters!")
    .optional();

// Zod schema for individual task
export const taskZodSchema = z.object({
    task: z
        .string()
        .trim()
        .min(1, "Task cannot be empty!")
        .max(40, "Task cannot exceed 40 characters!"),
    achieved: z.number().min(0).default(0),
    completed: z.boolean().default(false),
});

// Zod schema for the Task model
export const areaZodSchema = z.object({
    userId: z.string().min(1),
    area: areaNameZodSchema,
    note: noteZodSchema,
    tasks: z.array(taskZodSchema).nonempty("Tasks cannot be empty!"),
});
