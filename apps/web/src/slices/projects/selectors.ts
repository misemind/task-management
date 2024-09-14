import { createSelector } from '@reduxjs/toolkit';

// Selectors for Projects
export const selectProjectLists = (state: any) => state.Projects.projects.list;
export const selectProjectCount = (state: any) => state.Projects.projects.total;
export const selectProjectError = (state: any) => state.Projects.projects.error;

// Selectors for Documents
export const selectDocumentList = (state: any) => state.Projects.documents.list;
export const selectDocumentCount = (state: any) => state.Projects.documents.total;
export const selectCurrentDocument = (state: any) => state.Projects.documents.current;
export const selectDocumentError = (state: any) => state.Projects.documents.error;

// Selectors for Employees
export const selectEmployeeList = (state: any) => state.Projects.employees.list;
export const selectEmployeeCount = (state: any) => state.Projects.employees.total;
export const selectEmployeeError = (state: any) => state.Projects.employees.error;

// Selectors for Comments
export const selectCommentList = (state: any) => state.Projects.comments.list;
export const selectCommentCount = (state: any) => state.Projects.comments.total;
export const selectCommentError = (state: any) => state.Projects.comments.error;

// Combined Selector for Dashboard Data
export const selectDashboardData = createSelector(
    selectProjectLists,
    selectProjectCount,
    selectProjectError,
    selectDocumentList,
    selectDocumentCount,
    selectCurrentDocument,
    selectDocumentError,
    selectEmployeeList,
    selectEmployeeCount,
    selectEmployeeError,
    selectCommentList,
    selectCommentCount,
    selectCommentError,
    (
        projectLists,
        projectCount,
        projectError,
        documentList,
        documentCount,
        currentDocument,
        documentError,
        employeeList,
        employeeCount,
        employeeError,
        commentList,
        commentCount,
        commentError
    ) => ({
        projectLists,
        projectCount,
        projectError,
        documentList,
        documentCount,
        currentDocument,
        documentError,
        employeeList,
        employeeCount,
        employeeError,
        commentList,
        commentCount,
        commentError
    })
);
