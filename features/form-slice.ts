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
      state.tasks.unshift({
        task: newTask,
        achieved: 0,
        completed: false,
      });
      state.task = initialState.task;
    },
    handleTaskChange: (state, action) => {
      state.task = action.payload;
    },
    handleEmptyTasks: (state, action) => {
      state.etem = action.payload;
    },
    removeTask: (state, action) => {
      const index = action.payload;
      state.tasks = state.tasks.filter((_, i) => i !== index);
    },
    resetForm: () => initialState,
  },
});

export const {
  handleAreaChange,
  handleNoteChange,
  handleTaskChange,
  addToTasks,
  handleEmptyTasks,
  removeTask,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
