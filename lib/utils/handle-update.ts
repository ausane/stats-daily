import { OmitDocument, TTask } from "../types";

export async function updateTask(areaId: string, task: TTask) {
    try {
        const response = await fetch("/api/stats/task", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: areaId, taskId: task._id, task }),
        });

        if (!response.ok) throw new Error("Failed to update task");

        console.log(await response.json());
    } catch (error) {
        console.error(error);
    }
}

export async function updateNote(id: string, note: string) {
    try {
        const response = await fetch("/api/stats/task", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, note }),
        });

        if (!response.ok) throw new Error("Failed to update note");

        console.log(await response.json());
    } catch (error) {
        console.error(error);
    }
}

export async function createNewTask(id: string, task: OmitDocument<TTask>) {
    try {
        console.log(task);
        const response = await fetch("/api/stats/task", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, task }),
        });

        if (!response.ok) throw new Error("Failed to add new task");

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function updateAreaName(id: string, area: string) {
    try {
        console.log(area);
        const response = await fetch("/api/stats/task", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, area }),
        });

        const jsonResponse = await response.json();
        if (jsonResponse.duplicate) return jsonResponse;

        if (!response.ok) throw new Error("Failed to update area");

        return jsonResponse;
    } catch (error) {
        console.error(error);
    }
}
