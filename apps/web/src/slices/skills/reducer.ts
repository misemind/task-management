import { createSlice } from "@reduxjs/toolkit";
import { onGetSkills } from "./thunk";

export const initialState: any= {
    skills: [],
    error: null,
    status: 'idle', // for loading state
};

const SkillsSlice = createSlice({
    name: "SkillsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(onGetSkills.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(onGetSkills.fulfilled, (state, action:any) => {
                state.status = 'succeeded';
                state.skills = action.payload.map((skill: any) => ({
                    value: skill.name,
                    label: skill.name,
                }));
            })
            .addCase(onGetSkills.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default SkillsSlice.reducer;
