import { z } from "zod";
import { areaNameLength, areaNoteLength, taskLength } from "../constants";

// Define schema for `area`
export const areaNameZodSchema = z
  .string()
  .trim()
  .min(1, "Area cannot be empty!")
  .max(areaNameLength, `Area cannot exceed ${areaNameLength} characters!`);

// Define schema for `note`
export const noteZodSchema = z
  .string()
  .trim()
  .max(areaNoteLength, `Area note cannot exceed ${areaNoteLength} characters!`)
  .optional();

// Zod schema for individual task
export const taskZodSchema = z.object({
  task: z
    .string()
    .trim()
    .min(1, "Task cannot be empty!")
    .max(taskLength, `Task cannot exceed ${taskLength} characters!`),
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
