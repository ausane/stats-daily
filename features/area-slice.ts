import { createSlice } from "@reduxjs/toolkit";
import { TSC } from "@/lib/types";

const areaSlice = createSlice({
    name: "area",
    initialState: {
        areas: <TSC[]>[],
    },
    reducers: {
        setCurrentArea: (state, action) => {
            const task = state.areas.find((i) => i._id === action.payload._id);
            if (task) task.area = action.payload.area;
        },
        insertArea: (state, action) => {
            state.areas.unshift(action.payload);
        },
        insertAllAreas: (state, action) => {
            state.areas = action.payload;
        },
        removeAreaById: (state, action) => {
            const id = action.payload;
            state.areas = state.areas.filter((item) => item._id !== id);
        },
    },
});

export const { insertArea, insertAllAreas, removeAreaById, setCurrentArea } =
    areaSlice.actions;
export default areaSlice.reducer;
