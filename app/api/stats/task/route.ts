import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { taskSchemaZod } from "@/lib/schema-validation";
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
    taskUpdatedResponse,
    noteUpdatedResponse,
    newIncompleteTasksResponse,
    errorResponse,
    areaDeletionResponse,
    invalidAreaOrTasksResponse,
    invalidStatsResponse,
} from "@/lib/route/response";

// POST REQUEST HANDLER
export async function POST(request: NextRequest) {
    await connectToDatabase();

    try {
        const data = await request.json();

        // Validate data using Zod
        taskSchemaZod.parse(data);

        if (!data.area.trim() || !data.tasks.length) {
            return invalidAreaOrTasksResponse();
        }

        // Check for existing area
        const prevArea = await checkForExistingArea(data.area);

        if (prevArea) return duplicateAreaResponse(prevArea.area);

        // Create a new task
        const newTask = await createNewTask(data);

        return NextResponse.json({ _id: newTask._id, area: newTask.area });
    } catch (error) {
        console.error(error);
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

        if (area) {
            const duplicateArea = await checkForDuplicateArea(area);
            if (duplicateArea) return duplicateAreaResponse(area);

            await updateArea(id, area);
        }

        if (task && taskId) {
            await updateTask(id, taskId, task);
            return taskUpdatedResponse(id);
        }

        if (note) {
            await updateNote(id, note);
            return noteUpdatedResponse(id);
        }

        if (task && !taskId) {
            const newIncompleteTasks = await addNewTask(id, task);
            return newIncompleteTasksResponse(newIncompleteTasks);
        }

        return incompleteDataResponse(id);
    } catch (error) {
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
            return NextResponse.json({}, { status: 204 }); // No Content
        }

        if (id) {
            // Delete the area
            const area = await deleteAreaById(id);
            areaDeletionResponse(area);
        }
    } catch (error) {
        console.error(error);
        return errorResponse();
    }
}
