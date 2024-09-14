import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllEmployees as getAllEmployeesAPI, getEmployee as getEmployeeAPI} from "../../helpers/fakebackend_helper";

export const getAllEmployees = createAsyncThunk(
  "EmploeesSlice/getAllEmployees",
  async () => {
    try {
      const response = await getAllEmployeesAPI();
      console.log("getAllEmployees",response)
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const getEmployee = createAsyncThunk(
  "EmploeesSlice/getEmployee",
  async () => {
    try {
      const response = await getEmployeeAPI();
      console.log("getEmployee",response)
      return response;
    } catch (error) {
      return error;
    }
  }
);

