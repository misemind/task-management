import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { getProjectById } from "./thunk"; // Update with the correct path

interface ProjectState {
  activeTab: string;
  data: any;  // Replace `any` with the appropriate type for your project data
  loading: boolean;
  error: string | SerializedError | null;
}

const initialState: ProjectState = {
  activeTab: "1",
  data: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projectOverview",
  initialState,
  reducers: {
    // Action to set the active tab
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    // Action to clear the project overview state
    clearProjectOverview: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state (when the request is in progress)
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle the fulfilled state (when the request is successful)
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      // Handle the rejected state (when the request fails)
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { setActiveTab, clearProjectOverview } = projectSlice.actions;
export default projectSlice.reducer;
