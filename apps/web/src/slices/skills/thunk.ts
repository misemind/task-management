import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSkills } from "helpers/fakebackend_helper";
import { toast } from "react-toastify";

// Thunk to fetch skills
export const onGetSkills = createAsyncThunk("skills/fetchSkillsList", async ({limit,page}:any) => {
    try {
        const response = await getSkills(limit,page);
        const data = response;
        // toast.success("Skills list fetched successfully", { autoClose: 3000 });
        return data;
    } catch (error) {
        // toast.error("Failed to fetch skills list", { autoClose: 3000 });
        throw error;
    }
});
