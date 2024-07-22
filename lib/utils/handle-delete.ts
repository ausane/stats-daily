export async function deleteArea(id: string | undefined) {
    console.log(id);

    try {
        const response = await fetch("/api/stats/task", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error("Failed to delete task");

        console.log("Area deleted successfully!", await response.json());
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function deleteTask(id: string, taskId: string) {
    try {
        const response = await fetch("/api/stats/task", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, taskId }),
        });

        if (!response.ok) throw new Error("Failed to delete task");

        console.log("Task deleted successfully!", await response.json());
    } catch (error) {
        console.error("Error:", error);
    }
}
