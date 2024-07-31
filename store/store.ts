import { configureStore } from "@reduxjs/toolkit";
import formReducer from "@/features/formSlice";
import areaReducer from "@/features/areaSlice";
import taskReducer from "@/features/taskSlice";

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
