import { createSlice } from "@reduxjs/toolkit";
import {
    getTeamData,
    addTeamData,
    updateTeamData,
    deleteTeamData,
    addExperienceData,
    updateExperienceData,
    deleteExperienceData,
    getExperienceData,
    getTeamDataById,
    getActivities,
    addDocumentData,
    deleteDocumentData,
    getDocumentsData,
    updateDocumentData,
    getAllProjectEmployeesByEmployee
} from './thunk';

export const initialState: any = {
    team: {
        list: [],
        total: 0,
        detail: null,  // Storing detailed team information
    },
    experiences: {
        list: [],
    },
    activities: [],
    documents: {
        list: [],
        total: 0,
    },
    projects: {
        list: [],
        total: 0,
    },
    errors: {}, // All errors are grouped here
};

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Team Data Cases
        builder.addCase(getTeamData.fulfilled, (state: any, action: any) => {
            state.team.list = action.payload.employees;
            state.team.total=action.payload.total;
        });
        builder.addCase(getTeamData.rejected, (state: any, action: any) => {
            state.errors.team = action.payload.error || null;
        });
        builder.addCase(addTeamData.fulfilled, (state: any, action: any) => {
            state.team.list.unshift(action.payload);
        });
        builder.addCase(addTeamData.rejected, (state: any, action: any) => {
            state.errors.team = action.payload.error || null;
        });
        builder.addCase(updateTeamData.fulfilled, (state: any, action: any) => {
            state.team.list = state.team.list.map((team: any) =>
                team._id.toString() === action.payload._id.toString()
                    ? { ...team, ...action.payload }
                    : team
            );
        });
        builder.addCase(updateTeamData.rejected, (state: any, action: any) => {
            state.errors.team = action.payload.error || null;
        });
        builder.addCase(deleteTeamData.fulfilled, (state: any, action: any) => {
            state.team.list = state.team.list.filter((team: any) => (team.id + "") !== (action.payload + ""));
        });
        builder.addCase(deleteTeamData.rejected, (state: any, action: any) => {
            state.errors.team = action.payload.error || null;
        });

        // Separate Case for getTeamDataById
        builder.addCase(getTeamDataById.fulfilled, (state: any, action: any) => {
            state.team.detail = action.payload;
        });
        builder.addCase(getTeamDataById.rejected, (state: any, action: any) => {
            state.errors.teamDetail = action.payload.error || null;
        });

        // Experience Data Cases
        builder.addCase(getExperienceData.fulfilled, (state: any, action: any) => {
            state.experiences.list = action.payload;
        });
        builder.addCase(getExperienceData.rejected, (state: any, action: any) => {
            state.errors.experience = action.payload.error || null;
        });
        builder.addCase(addExperienceData.fulfilled, (state: any, action: any) => {
            state.experiences.list.unshift(action.payload);
        });
        builder.addCase(addExperienceData.rejected, (state: any, action: any) => {
            state.errors.experience = action.payload.error || null;
        });
        builder.addCase(updateExperienceData.fulfilled, (state: any, action: any) => {
            state.experiences.list = state.experiences.list.map((experience: any) =>
                experience._id.toString() === action.payload._id.toString()
                    ? { ...experience, ...action.payload }
                    : experience
            );
        });
        builder.addCase(updateExperienceData.rejected, (state: any, action: any) => {
            state.errors.experience = action.payload.error || null;
        });
        builder.addCase(deleteExperienceData.fulfilled, (state: any, action: any) => {
            state.experiences.list = state.experiences.list.filter((experience: any) => (experience._id + "") !== (action.payload + ""));
        });
        builder.addCase(deleteExperienceData.rejected, (state: any, action: any) => {
            state.errors.experience = action.payload.error || null;
        });

        // Activities Data Cases
        builder.addCase(getActivities.fulfilled, (state: any, action: any) => {
            state.activities = action.payload;
        });
        builder.addCase(getActivities.rejected, (state: any, action: any) => {
            state.errors.activities = action.payload.error || null;
        });

        // Document Data Cases
        builder.addCase(getDocumentsData.fulfilled, (state: any, action: any) => {
            state.documents.list = action.payload.documents;
            state.documents.total = action.payload.total;
        });
        builder.addCase(getDocumentsData.rejected, (state: any, action: any) => {
            state.errors.documents = action.payload.error || null;
        });
        builder.addCase(addDocumentData.fulfilled, (state: any, action: any) => {
            state.documents.list.unshift(action.payload);
        });
        builder.addCase(addDocumentData.rejected, (state: any, action: any) => {
            state.errors.documents = action.payload.error || null;
        });
        builder.addCase(updateDocumentData.fulfilled, (state: any, action: any) => {
            state.documents.list = state.documents.list.map((document: any) =>
                document._id.toString() === action.payload._id.toString()
                    ? { ...document, ...action.payload }
                    : document
            );
        });
        builder.addCase(updateDocumentData.rejected, (state: any, action: any) => {
            state.errors.documents = action.payload.error || null;
        });
        builder.addCase(deleteDocumentData.fulfilled, (state: any, action: any) => {
            state.documents.list = state.documents.list.filter((document: any) => (document._id + "") !== (action.payload + ""));
        });
        builder.addCase(deleteDocumentData.rejected, (state: any, action: any) => {
            state.errors.documents = action.payload.error || null;
        });

        // Project Data Cases
        builder.addCase(getAllProjectEmployeesByEmployee.fulfilled, (state: any, action: any) => {
            state.projects.list = action.payload.employeeProjects;
            state.projects.total = action.payload.total;
        });
        builder.addCase(getAllProjectEmployeesByEmployee.rejected, (state: any, action: any) => {
            state.errors.projects = action.payload.error || null;
        });
    }
});

export default teamSlice.reducer;
