import { configureStore } from "@reduxjs/toolkit";
import formReducer from "@/features/form-slice";
import areaReducer from "@/features/area-slice";
import taskReducer from "@/features/task-slice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    area: areaReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
