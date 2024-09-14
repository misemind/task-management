import { createSlice } from "@reduxjs/toolkit";
import { getAllEmployees, getEmployee } from "./thunk";
export const initialState: any = {
  allEmployee: [],
  employee:{},
  error: {},
};

const EmploeesSlice = createSlice({
  name: "EmploeesSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllEmployees.fulfilled, (state: any, action: any) => {
      state.allEmployee = action.payload;
    });

    builder.addCase(getAllEmployees.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
    });

    builder.addCase(getEmployee.fulfilled, (state: any, action: any) => {
        state.employee = action.payload;
      });
  
      builder.addCase(getEmployee.rejected, (state: any, action: any) => {
        state.error = action.payload.error || null;
      });
  },
});

export default EmploeesSlice.reducer;
