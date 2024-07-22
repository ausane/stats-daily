import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "@/lib/constants";

const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        handleAreaChange: (state, action) => {
            state.area = action.payload;
        },
        handleNoteChange: (state, action) => {
            state.note = action.payload;
        },
        addToTasks: (state) => {
            const newTask = state.task;
            state.tasks.unshift(newTask);
            state.task = initialState.task;
        },
        handleTaskChange: (state, action) => {
            const { name, value } = action.payload;

            state.task = {
                ...state.task,
                [name]: value,
            };
        },
        handleErrMsg: (state, action) => {
            state.errMsg = action.payload;
        },
        deleteTask: (state, action) => {
            const index = action.payload;
            state.tasks = state.tasks.filter((_, i) => i !== index);
        },
        resetForm: () => initialState,
        // setInitialState: (state, action) => {
        //     // console.log(state);
        //     const { area, note, tasks } = action.payload;
        //     return {
        //         ...state,
        //         area,
        //         note,
        //         tasks,
        //     };
        // },
    },
});

export const {
    handleAreaChange,
    handleNoteChange,
    handleTaskChange,
    addToTasks,
    handleErrMsg,
    deleteTask,
    resetForm,
    // setInitialState,
} = formSlice.actions;

export default formSlice.reducer;
