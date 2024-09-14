import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProjectById = createAsyncThunk(
    "projectOverview/fetchEmployeeOverview",
    async (projectId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`api/projects/${projectId}`);
            return response;  // <-- Return the response data
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);