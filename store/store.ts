import { configureStore } from "@reduxjs/toolkit";
import formReducer from "@/features/formSlice";
import areaSlice from "@/features/areaSlice";

export const store = configureStore({
    reducer: {
        form: formReducer,
        area: areaSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
