import { z } from "zod";

// Zod schema for individual task
export const taskZodSchema = z.object({
    task: z.string().trim().min(1, "Task cannot be empty."),
    achieved: z.number().min(0).default(0),
    completed: z.boolean().default(false),
});

// Zod schema for the Task model
export const taskSchemaZod = z.object({
    area: z.string().trim().min(1, "Area cannot be empty."),
    note: z.string().trim().optional(),
    tasks: z.array(taskZodSchema).nonempty("Tasks cannot be empty."),
});
