import { createSelector } from '@reduxjs/toolkit';

// Selectors for Team Data
export const selectTeamList = (state: any) => state.Team.team.list;
export const selectTeamCount = (state: any) => state.Team.team.total;
export const selectTeamDetail = (state: any) => state.Team.team.detail;
export const selectTeamError = (state: any) => state.Team.errors.team;

// Selectors for Experience Data
export const selectExperienceList = (state: any) => state.Team.experiences.list;
export const selectExperienceError = (state: any) => state.Team.errors.experience;

// Selectors for Activities
export const selectActivities = (state: any) => state.Team.activities;
export const selectActivitiesError = (state: any) => state.Team.errors.activities;

// Selectors for Documents
export const selectDocumentList = (state: any) => state.Team.documents.list;
export const selectDocumentCount = (state: any) => state.Team.documents.total;
export const selectDocumentError = (state: any) => state.Team.errors.documents;

// Selectors for Projects
export const selectProjectList = (state: any) => state.Team.projects.list;
export const selectProjectCount = (state: any) => state.Team.projects.total;
export const selectProjectError = (state: any) => state.Team.errors.projects;

// Combined Selector for Dashboard Data
export const selectDashboardData = createSelector(
    selectTeamList,
    selectTeamCount,
    selectTeamDetail,
    selectExperienceList,
    selectActivities,
    selectDocumentList,
    selectDocumentCount,
    selectProjectList,
    selectProjectCount,
    (
        teamList,
        teamCount,
        teamDetail,
        experienceList,
        activities,
        documentList,
        documentCount,
        projectList,
        projectCount
    ) => ({
        teamList,
        teamCount,
        teamDetail,
        experienceList,
        activities,
        documentList,
        documentCount,
        projectList,
        projectCount
    })
);
