import { TTask } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
    name: "task",
    initialState: {
        incompleteTasks: <TTask[]>[],
        completedTasks: <TTask[]>[],
    },
    reducers: {
        setIncompleteTasks: (state, action) => {
            state.incompleteTasks = action.payload;
        },
        setCompleteTasks: (state, action) => {
            state.completedTasks = action.payload;
        },

        setTaskCompletion: (state, action) => {
            console.log(action.payload);
            const { index, achieved } = action.payload;
            const taskItem = state.incompleteTasks[index];

            taskItem.completed = true;
            taskItem.achieved = achieved;

            // Push the task to completed tasks
            state.completedTasks.push(taskItem);

            // Remove the task from incompleted tasks
            state.incompleteTasks = state.incompleteTasks.filter(
                (item) => item._id !== taskItem._id
            );
        },
        undoTaskCompletion: (state, action) => {
            const index = action.payload;
            const taskItem = state.completedTasks[index];

            taskItem.completed = false;
            taskItem.achieved = 0;

            // Push the task to completed tasks
            state.incompleteTasks.push(taskItem);

            // Remove the task from incompleted tasks
            state.completedTasks = state.completedTasks.filter(
                (item) => item._id !== taskItem._id
            );
        },
        removeTaskById: (state, action) => {
            const taskId = action.payload;
            state.incompleteTasks = state.incompleteTasks.filter(
                (item) => item._id !== taskId
            );
        },
        setEditedTask: (state, action) => {
            const { index, task } = action.payload;
            state.incompleteTasks[index].task = task;
        },
    },
});

export const {
    setCompleteTasks,
    setIncompleteTasks,
    setTaskCompletion,
    undoTaskCompletion,
    removeTaskById,
    setEditedTask,
} = taskSlice.actions;

export default taskSlice.reducer;
