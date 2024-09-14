import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
    getTeamData as getTeamDataApi,
    getTeamDataById as getTeamDataByIdApi,
    addTeamData as addTeamDataApi,
    updateTeamData as updateTeamDataApi,
    deleteTeamData as deleteTeamDataApi,
    getExperienceData as getExperienceDataApi,
    addExperienceData as addExperienceDataApi,
    updateExperienceData as updateExperienceDataApi,
    deleteExperienceData as deleteExperienceDataApi,
    getActivities as getActivitiesApi,
    getDocumentsData as getDocumentsDataApi,
    addDocumentData as addDocumentDataApi,
    updateDocumentData as updateDocumentDataApi,
    deleteDocumentData as deleteDocumentDataApi,
    downloadDocumentData as getDocumentDownloadApi,
    getAllProjectEmployeesByEmployee as getAllProjectEmployeesByEmployeeApi

} from "../../helpers/fakebackend_helper";

export const getTeamData = createAsyncThunk(
    "team/getTeamData",
    async ({ page, limit }: { page: number; limit: number }) => {
        try {
            const response = await getTeamDataApi({ page, limit });
            return response;
        } catch (error) {
            return error;
        }
    }
);

export const addTeamData = createAsyncThunk("team/addTeamData", async (team: any) => {
    try {
        const response = await addTeamDataApi(team);
        const data = await response;
        toast.success("Team Data Added Successfully", { autoClose: 3000 });
        return data;
    } catch (error) {
        toast.error("Team Data Added Failed", { autoClose: 3000 });
        return error;
    }
});

export const updateTeamData = createAsyncThunk("team/updateTeamData", async (project: any) => {
    try {
        const response = await updateTeamDataApi(project);
        toast.success("Team Data Updated Successfully", { autoClose: 3000 });
        return response;
    } catch (error) {
        toast.error("Team Data Updated Failed", { autoClose: 3000 });
        return error;
    }
});
export const getTeamDataById = createAsyncThunk(
    "team/getTeamDataById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await getTeamDataByIdApi(id);  // API call to fetch data by ID
            return response;
        } catch (error) {
            toast.error("Failed to fetch team data", { autoClose: 3000 });
            return rejectWithValue(error);
        }
    }
);

export const deleteTeamData = createAsyncThunk("team/deleteTeamData", async (project: any) => {
    try {
        const response = await deleteTeamDataApi(project);
        console.log('deleteTeamData', response)
        toast.success("Team Data Delete Successfully", { autoClose: 3000 });
        return response;
    } catch (error) {
        toast.error("Team Data Delete Failed", { autoClose: 3000 });
        return error;
    }
});

export const getExperienceData = createAsyncThunk(
    "team/getExperienceData",
    async (employee_id: string, { rejectWithValue }) => {
        try {
            const response = await getExperienceDataApi(employee_id);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const addExperienceData = createAsyncThunk("experience/addExperienceData", async (experience: any) => {
    try {
        console.log('!!!!!!!addExperienceData', experience)
        const response = await addExperienceDataApi(experience);
        const data = await response;
        toast.success("Experience Data Added Successfully", { autoClose: 3000 });
        return data;
    } catch (error) {
        toast.error("Failed to Add Experience Data", { autoClose: 3000 });
        return error;
    }
});

// Thunk to update experience data
export const updateExperienceData = createAsyncThunk("experience/updateExperienceData", async (experience: any) => {
    try {
        console.log('!!!!!!!updateExperienceData', experience)
        const response = updateExperienceDataApi(experience);
        toast.success("Experience Data Updated Successfully", { autoClose: 3000 });
        return response;
    } catch (error) {
        toast.error("Failed to Update Experience Data", { autoClose: 3000 });
        return error;
    }
});

export const deleteExperienceData = createAsyncThunk("experience/deleteExperienceData", async (experienceId: string) => {
    try {
        const response = await deleteExperienceDataApi(experienceId);
        toast.success("Experience Data Deleted Successfully", { autoClose: 3000 });
        return experienceId; // Returning the experienceId to remove it from the state in the reducer
    } catch (error) {
        toast.error("Failed to Delete Experience Data", { autoClose: 3000 });
        return error;
    }
});


export const getActivities = createAsyncThunk("activities/fetchActivitiesList", async (payload: { limit: number, page: number }) => {
    try {
        const response = await getActivitiesApi(payload.limit, payload.page);
        const data = response;
        console.log(data, '@#@#@#@#@#@#')
        toast.success("activities list fetched successfully", { autoClose: 3000 });
        return data;
    } catch (error) {
        toast.error("Failed to fetch activities list", { autoClose: 3000 });
        throw error;
    }
});
// Thunk to add document data
export const addDocumentData = createAsyncThunk("team/addDocumentData", async ({ employeeId, document }: { employeeId: string; document: any }) => {
    try {
        const response = await addDocumentDataApi(employeeId, document);
        toast.success("Document Added Successfully", { autoClose: 3000 });
        return response;
    } catch (error) {
        toast.error("Failed to Add Document", { autoClose: 3000 });
        return error;
    }
});

// Thunk to get documents data
export const getDocumentsData = createAsyncThunk("team/getDocumentsData", async (employeeId: string) => {
    try {
        const response = await getDocumentsDataApi(employeeId);
        return response;
    } catch (error) {
        toast.error("Failed to Fetch Documents", { autoClose: 3000 });
        return error;
    }
});

// Thunk to update document data
export const updateDocumentData = createAsyncThunk("team/updateDocumentData", async ({ employeeId, documentId, document }: { employeeId: string; documentId: string; document: any }) => {
    try {
        const response = await updateDocumentDataApi(employeeId, documentId, document);
        toast.success("Document Updated Successfully", { autoClose: 3000 });
        return response;
    } catch (error) {
        toast.error("Failed to Update Document", { autoClose: 3000 });
        return error;
    }
});

// Thunk to delete document data
export const deleteDocumentData = createAsyncThunk("team/deleteDocumentData", async ({ employeeId, documentId }: { employeeId: string; documentId: string }) => {
    try {
        const response = await deleteDocumentDataApi(employeeId, documentId);
        toast.success("Document Deleted Successfully", { autoClose: 3000 });
        return documentId;
    } catch (error) {
        toast.error("Failed to Delete Document", { autoClose: 3000 });
        return error;
    }
});

export const downloadDocumentData = createAsyncThunk(
    "team/downloadDocumentData",
    async ({ employeeId, documentId, name, type }:
        { employeeId: string; documentId: string; name: string; type: string }) => {
        try {
            await getDocumentDownloadApi(employeeId, documentId, name, type);
            toast.success("Document Downloaded Successfully", { autoClose: 3000 });
            return name;
        } catch (error) {
            toast.error("Failed to Download Document", { autoClose: 3000 });
            throw error; // Throw error to handle it in the UI if needed
        }
    }
);

export const getAllProjectEmployeesByEmployee = createAsyncThunk(
    "teams/getAllProjectEmployeesByEmployee",
    async ({ employeeId, limit, page }: { employeeId: string; limit: number; page: number }) => {
        try {
            const response = await getAllProjectEmployeesByEmployeeApi(employeeId, limit, page);
            return response;
        } catch (error) {
            toast.error("Failed to fetch project employees by employee", { autoClose: 3000 });
            return error;
        }
    }
);