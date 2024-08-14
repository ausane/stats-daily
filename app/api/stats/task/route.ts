import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import {
    areaZodSchema,
    areaNameZodSchema,
    noteZodSchema,
    taskZodSchema,
} from "@/lib/zod-schema";
import { z } from "zod";
import {
    isValidObjectId,
    checkForDuplicateArea,
    updateArea,
    updateTask,
    updateNote,
    addNewTask,
    findTaskById,
    deleteTaskByTaskId,
    deleteAreaById,
    createNewTask,
    checkForExistingArea,
} from "@/lib/route/task-utils";
import {
    invalidIdResponse,
    noAreaFoundResponse,
    incompleteDataResponse,
    duplicateAreaResponse,
    newAreaCreatedResponse,
    taskUpdatedResponse,
    noteUpdatedResponse,
    newIncompleteTasksResponse,
    errorResponse,
    areaDeletionResponse,
    invalidStatsResponse,
    areaRenamedResponse,
    zodErrorResponse,
} from "@/lib/route/response";

// POST REQUEST HANDLER
export async function POST(request: NextRequest) {
    await connectToDatabase();

    try {
        const data = await request.json();

        // Validate data using Zod
        areaZodSchema.parse(data);

        // Check for existing area
        const prevArea = await checkForExistingArea(data.area);
        if (prevArea) return duplicateAreaResponse(prevArea.area);

        // Create a new area
        const newArea = await createNewTask(data);
        return newAreaCreatedResponse(newArea);
    } catch (error) {
        console.error(error);

        if (error instanceof z.ZodError) return zodErrorResponse(error);
        return invalidStatsResponse();
    }
}

// PATCH REQUEST HANDLER
export async function PATCH(request: NextRequest) {
    await connectToDatabase();

    try {
        const { id, taskId, task, note, area } = await request.json();

        if (!isValidObjectId(id)) return invalidIdResponse();
        if (taskId && !isValidObjectId(taskId)) return invalidIdResponse();

        const item = await findTaskById(id);
        if (!item) return noAreaFoundResponse();

        // Update area name by ID
        if (area) {
            areaNameZodSchema.parse(area);

            const duplicateArea = await checkForDuplicateArea(area);
            if (duplicateArea) return duplicateAreaResponse(area);

            await updateArea(id, area);
            return areaRenamedResponse(id, area);
        }

        // Update task by ID
        if (task && taskId) {
            taskZodSchema.parse(task);
            await updateTask(id, taskId, task);
            return taskUpdatedResponse(id);
        }

        // Update note by ID
        if (typeof note === "string") {
            noteZodSchema.parse(note);
            await updateNote(id, note);
            return noteUpdatedResponse(id);
        }

        // Add new task to the area by ID
        if (task && !taskId) {
            taskZodSchema.parse(task);
            const newIncompleteTasks = await addNewTask(id, task);
            return newIncompleteTasksResponse(newIncompleteTasks);
        }

        return incompleteDataResponse(id);
    } catch (error) {
        console.error(error);

        if (error instanceof z.ZodError) return zodErrorResponse(error);
        return errorResponse();
    }
}

// DELETE REQUEST HANDLER
export async function DELETE(request: NextRequest) {
    await connectToDatabase();

    try {
        const { id, taskId } = await request.json();

        // Validate ObjectId
        if (!isValidObjectId(id)) return invalidIdResponse();
        if (taskId && !isValidObjectId(taskId)) return invalidIdResponse();

        // Find the task by ID
        const item = await findTaskById(id);
        if (!item) return noAreaFoundResponse();

        if (taskId) {
            // Delete specific task from the tasks array
            await deleteTaskByTaskId(id, taskId);
            return NextResponse.json({ status: 204 });
        }

        // Delete the area
        const area = await deleteAreaById(id);
        return areaDeletionResponse(area);
    } catch (error) {
        console.error(error);
        return errorResponse();
    }
}
