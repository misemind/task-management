import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Include Both Helper File with needed methods
import {
    getProjectList as getProjectListApi,
    addProjectList as addProjectListApi,
    updateProjectList as updateProjectListApi,
    deleteProjectList as deleteProjectListApi,
    addProjectDocument as addProjectDocumentApi,
    downloadProjectDocument as downloadProjectDocumentApi,
    updateProjectDocument as updateProjectDocumentApi,
    deleteProjectDocument as deleteProjectDocumentApi,
    getAllProjectEmployeesByProject as getAllProjectEmployeesByProjectApi,
    addProjectEmployee as addProjectEmployeeApi,
    deleteProjectEmployee as deleteProjectEmployeeApi,
    getCommentsByProject as getCommentsByProjectApi,
    addComment as addCommentApi,
    updateComment as updateCommentApi,
    deleteComment as deleteCommentApi,
    getProjectDocumentsApi,
} from "../../helpers/fakebackend_helper";


export const getProjectList = createAsyncThunk(
    "projects/getProjectList",
    async ({ page, limit }: any, { rejectWithValue }) => {
        try {
            const response = await getProjectListApi({ page, limit });
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error?.message);
        }
    }
);
export const addProjectList = createAsyncThunk("projects/addProjectList", async (project: any) => {
    try {
        const response = await addProjectListApi(project);
        // const data = await response;
        toast.success("project-list Added Successfully", { autoClose: 3000 });
        return response;
    } catch (error) {
        toast.error("project-list Added Failed", { autoClose: 3000 });
        return error;
    }
});

export const updateProjectList = createAsyncThunk(
    "projects/updateProjectList",
    async ({ id, project }: { id: string; project: any }, { rejectWithValue }) => {
        try {
            const response = await updateProjectListApi(id, project);  // Pass ID and project object to API
            // const data = await response;
            toast.success("Project updated successfully", { autoClose: 3000 });
            return response;
        } catch (error) {
            toast.error("Failed to update project", { autoClose: 3000 });
            // return rejectWithValue(error.response ? error.response.data : error.message);
            return error;
        }
    }
);

export const deleteProjectList = createAsyncThunk("projects/deleteProjectList", async (id: any) => {
    try {
        const response = deleteProjectListApi(id);
        const newdata = await response;
        toast.success("project-list Delete Successfully", { autoClose: 3000 });
        return newdata;
    } catch (error) {
        toast.error("project-list Delete Failed", { autoClose: 3000 });
        return error;
    }
});

export const getProjectDocumentsList = createAsyncThunk(
    'document/getDocumentData',
    async ({ projectId, page, limit }: { projectId: string; page: number; limit: number }, { rejectWithValue }) => {
        try {
            const response = await getProjectDocumentsApi(projectId, page, limit);
            return response;
        } catch (error) {
            // Return a rejected value for proper error handling in Redux
            return error;
        }
    }
);


export const addProjectDocument = createAsyncThunk("projects/documents/addProjectDocument", async ({ projectId, document }: any) => {
    try {
        const response = addProjectDocumentApi(projectId, document);
        const data = await response;
        toast.success("Document Added Successfully", { autoClose: 3000 });
        return data;
    } catch (error) {
        toast.error("Document Addition Failed", { autoClose: 3000 });
        return error;
    }
});



export const downloadProjectDocument = createAsyncThunk(
    "projects/documents/downloadProjectDocument",
    async ({ projectId, documentId, name, type }:
        { projectId: string; documentId: string; name: string; type: string }) => {
        try {
            await downloadProjectDocumentApi(projectId, documentId, name, type);
            toast.success("Document Downloaded Successfully", { autoClose: 3000 });
        } catch (error) {
            toast.error("Failed to Download Document", { autoClose: 3000 });
            throw error; // Throw error to handle it in the UI if needed
        }
    }
);


export const updateProjectDocument = createAsyncThunk("projects/documents/updateProjectDocument", async ({ projectId, document }: any) => {
    try {
        const response = updateProjectDocumentApi(projectId, document);
        const data = await response;
        toast.success("Document Updated Successfully", { autoClose: 3000 });
        return data;
    } catch (error) {
        toast.error("Document Update Failed", { autoClose: 3000 });
        return error;
    }
});

export const deleteProjectDocument = createAsyncThunk("projects/documents/deleteProjectDocument", async ({ projectId, documentId }: any) => {
    try {
        const response = deleteProjectDocumentApi(projectId, documentId);
        const data = await response;
        toast.success("Document Deleted Successfully", { autoClose: 3000 });
        return data;
    } catch (error) {
        toast.error("Document Deletion Failed", { autoClose: 3000 });
        return error;
    }
});

// export const listProjectDocuments = createAsyncThunk("projects/documents/listProjectDocuments", async (projectId: string) => {
//     try {
//         const response = listProjectDocumentsApi(projectId);
//         return response;
//     } catch (error) {
//         toast.error("Failed to Fetch Documents", { autoClose: 3000 });
//         return error;
//     }
// });



export const getAllProjectEmployeesByProject = createAsyncThunk(
    "projects/getAllProjectEmployeesByProject",
    async ({ projectId, limit, page }: { projectId: string; limit: number; page: number }) => {
        try {
            const response = await getAllProjectEmployeesByProjectApi(projectId, limit, page);
            return response;
        } catch (error) {
            toast.error("Failed to fetch project employees by project", { autoClose: 3000 });
            return error;
        }
    }
);



export const addProjectEmployee = createAsyncThunk(
    "projects/addProjectEmployee",
    async (data: any) => {
        try {
            const response = await addProjectEmployeeApi(data);
            toast.success("Project employee added successfully", { autoClose: 3000 });
            return response;
        } catch (error) {
            toast.error("Failed to add project employee", { autoClose: 3000 });
            return error;
        }
    }
);

export const deleteProjectEmployee = createAsyncThunk(
    "projects/deleteProjectEmployee",
    async ({ projectId, employeeId }: { projectId: string; employeeId: string }) => {
        try {
            const response = await deleteProjectEmployeeApi(projectId, employeeId);
            toast.success("Project employee deleted successfully", { autoClose: 3000 });
            return response;
        } catch (error) {
            toast.error("Failed to delete project employee", { autoClose: 3000 });
            return error;
        }
    }
);

// Thunk for fetching comments by project ID
export const getCommentsByProject = createAsyncThunk(
    "projects/comments/getCommentsByProject",
    async ({ projectId, limit, page }: { projectId: string; limit: number; page: number }) => {
        try {
            const response = await getCommentsByProjectApi(projectId, limit, page);
            return response;
        } catch (error) {
            toast.error("Failed to fetch comments", { autoClose: 3000 });
            return error;
        }
    }
);

// Thunk for adding a new comment
export const addComment = createAsyncThunk(
    "projects/comments/addComment",
    async ({ projectId, comment }: { projectId: string; comment: any }) => {
        try {
            const response = await addCommentApi(projectId, comment);
            toast.success("Comment added successfully", { autoClose: 3000 });
            return response;
        } catch (error) {
            toast.error("Failed to add comment", { autoClose: 3000 });
            return error;
        }
    }
);

// Thunk for updating an existing comment
export const updateComment = createAsyncThunk(
    "projects/comments/updateComment",
    async ({ projectId, commentId, comment }: { projectId: string; commentId: string; comment: any }) => {
        try {
            const response = await updateCommentApi(projectId, commentId, comment);
            toast.success("Comment updated successfully", { autoClose: 3000 });
            return response;
        } catch (error) {
            toast.error("Failed to update comment", { autoClose: 3000 });
            return error;
        }
    }
);

// Thunk for deleting a comment
export const deleteComment = createAsyncThunk(
    "projects/comments/deleteComment",
    async ({ projectId, commentId }: { projectId: string; commentId: string }) => {
        try {
            const response = await deleteCommentApi(projectId, commentId);
            toast.success("Comment deleted successfully", { autoClose: 3000 });
            return response;
        } catch (error) {
            toast.error("Failed to delete comment", { autoClose: 3000 });
            return error;
        }
    }
);

