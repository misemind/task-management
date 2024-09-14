import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getProjectList,
    addProjectList,
    updateProjectList,
    deleteProjectList,
    addProjectDocument,
    deleteProjectDocument,
    downloadProjectDocument,
    updateProjectDocument,
    addProjectEmployee,
    deleteProjectEmployee,
    getAllProjectEmployeesByProject,
    addComment,
    deleteComment,
    getCommentsByProject,
    updateComment,
    getProjectDocumentsList
} from './thunk';

interface Comment {
    _id: string;
    content: string;
    parentId: string | null;
    replies: Comment[];
    [key: string]: any; // For any additional fields in the comment
}

interface ProjectState {
    projects: {
        list: any[];
        total: number;
        error: any;
    };
    documents: {
        list: any[];
        total: number;
        current: any;
        error: any;
    };
    employees: {
        list: any[];
        total: number;
        error: any;
    };
    comments: {
        list: any[];
        total: number;
        error: any;
        currentProjectId: null,
    };
}

export const initialState: ProjectState = {
    projects: {
        list: [],
        total: 0,
        error: null,
    },
    documents: {
        list: [],
        total: 0,
        current: null,
        error: null,
    },
    employees: {
        list: [],
        total: 0,
        error: null,
    },
    comments: {
        list: [],
        total: 0,
        error: null,
        currentProjectId: null,
    },
};

// Helper function to recursively find the parent comment and add the reply
const addReplyToComment = (comments: Comment[], parentId: string, reply: Comment): Comment[] => {
    return comments.map(comment => {
        if (comment._id === parentId) {
            return {
                ...comment,
                replies: [...comment.replies, reply],
            };
        } else if (comment.replies.length > 0) {
            return {
                ...comment,
                replies: addReplyToComment(comment.replies, parentId, reply),
            };
        } else {
            return comment;
        }
    });
};

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {

        // Reset Cases
        resetProjects: (state) => {
            state.projects = initialState.projects;
        },
        resetDocuments: (state) => {
            state.documents = initialState.documents;
        },
        resetEmployees: (state) => {
            state.employees = initialState.employees;
        },
        resetComments: (state) => {
            state.comments = initialState.comments;
        },
    },
    extraReducers: (builder) => {
        // Project List Cases
        builder.addCase(getProjectList.fulfilled, (state, action: PayloadAction<any>) => {
            state.projects.list = action.payload.projects;
            state.projects.total = action.payload.total;
        });
        builder.addCase(getProjectList.rejected, (state, action: PayloadAction<any>) => {
            state.projects.error = action.payload?.error || null;
        });
        builder.addCase(addProjectList.fulfilled, (state, action: PayloadAction<any>) => {
            state.projects.list.push(action.payload);
            state.projects.total += 1;
        });
        builder.addCase(addProjectList.rejected, (state, action: PayloadAction<any>) => {
            state.projects.error = action.payload?.error || null;
        });
        builder.addCase(updateProjectList.fulfilled, (state, action: PayloadAction<any>) => {
            state.projects.list = state.projects.list.map((project) =>
                project?._id === action.payload?._id ? { ...project, ...action.payload.data } : project
            );
        });
        builder.addCase(updateProjectList.rejected, (state, action: PayloadAction<any>) => {
            state.projects.error = action.payload?.error || null;
        });
        builder.addCase(deleteProjectList.fulfilled, (state, action: PayloadAction<any>) => {
            state.projects.list = state.projects.list.filter((project) => project.id !== action.payload.id);
            state.projects.total -= 1;
        });
        builder.addCase(deleteProjectList.rejected, (state, action: PayloadAction<any>) => {
            state.projects.error = action.payload?.error || null;
        });

        // Project Document Cases
        builder.addCase(getProjectDocumentsList.fulfilled, (state, action: PayloadAction<any>) => {
            state.documents.list = action.payload.documents;  // Assuming the response has 'documents' and 'total'
            state.documents.total = action.payload.total;
        });
        builder.addCase(getProjectDocumentsList.rejected, (state, action: PayloadAction<any>) => {
            state.documents.error = action.payload || null;
        });

        builder.addCase(addProjectDocument.fulfilled, (state, action: PayloadAction<any>) => {
            state.documents.list.push(action.payload);
            state.documents.total += 1;
        });
        builder.addCase(addProjectDocument.rejected, (state, action: PayloadAction<any>) => {
            state.documents.error = action.payload?.error || null;
        });
        builder.addCase(downloadProjectDocument.fulfilled, (state, action: PayloadAction<any>) => {
            state.documents.current = action.payload;
        });
        builder.addCase(downloadProjectDocument.rejected, (state, action: PayloadAction<any>) => {
            state.documents.error = action.payload?.error || null;
        });
        builder.addCase(updateProjectDocument.fulfilled, (state, action: PayloadAction<any>) => {
            state.documents.list = state.documents.list.map((doc) =>
                doc.id === action.payload.id ? { ...doc, ...action.payload } : doc
            );
        });
        builder.addCase(updateProjectDocument.rejected, (state, action: PayloadAction<any>) => {
            state.documents.error = action.payload?.error || null;
        });
        builder.addCase(deleteProjectDocument.fulfilled, (state, action: PayloadAction<any>) => {
            state.documents.list = state.documents.list.filter((doc) => doc._id !== action.payload.documentId);
            state.documents.total -= 1;
        });
        builder.addCase(deleteProjectDocument.rejected, (state, action: PayloadAction<any>) => {
            state.documents.error = action.payload?.error || null;
        });
        // builder.addCase(listProjectDocuments.fulfilled, (state, action: PayloadAction<any>) => {
        //     state.documents.list = action.payload.documents;
        //     state.documents.total = action.payload.total;
        // });
        // builder.addCase(listProjectDocuments.rejected, (state, action: PayloadAction<any>) => {
        //     state.documents.error = action.payload?.error || null;
        // });

        // Project Employee Cases
        builder.addCase(getAllProjectEmployeesByProject.fulfilled, (state, action: PayloadAction<any>) => {
            state.employees.list = action.payload.projectEmployees;
            state.employees.total = action.payload.total;
        });
        builder.addCase(getAllProjectEmployeesByProject.rejected, (state, action: PayloadAction<any>) => {
            console.log(action, 'myactivon error')
            state.employees.error = action.payload?.error || null;
        });
        builder.addCase(addProjectEmployee.fulfilled, (state, action: PayloadAction<any>) => {
            console.log(action, 'myactivon')
            state.employees.list.push(action.payload);
            state.employees.total += 1;
        });
        builder.addCase(addProjectEmployee.rejected, (state, action: PayloadAction<any>) => {
            state.employees.error = action.payload?.error || null;
        });
        builder.addCase(deleteProjectEmployee.fulfilled, (state, action: PayloadAction<any>) => {
            state.employees.list = state.employees.list.filter((employee) =>
                !(employee._id === action.payload.employeeId)
            );
            state.employees.total -= 1;
        });
        builder.addCase(deleteProjectEmployee.rejected, (state, action: PayloadAction<any>) => {
            state.employees.error = action.payload?.error || null;
        });

        // Comment Cases
        builder.addCase(getCommentsByProject.fulfilled, (state, action: PayloadAction<any>& AnyAction) => {
            const { projectId } = action.meta.arg;

            // Check if this is a different project, and reset comments if so
            if (state.comments.currentProjectId !== projectId) {
                state.comments.list = [];  // Reset comments list
                state.comments.total = 0;
                state.comments.currentProjectId = projectId;
            }
            state.comments.list = [...state.comments.list, ...action.payload];
            state.comments.total = action.payload.total;
        });
        builder.addCase(getCommentsByProject.rejected, (state, action: PayloadAction<any>) => {
            state.comments.error = action.payload?.error || null;
        });
        builder.addCase(addComment.fulfilled, (state, action: PayloadAction<any>) => {
            // state.comments.list.push(action.payload);
            const { parentId } = action.payload;

            if (parentId) {
                // Find the parent comment and add the reply
                state.comments.list = addReplyToComment(state.comments.list, parentId, action.payload);
            } else {
                // If no parentId, push as a root-level comment
                state.comments.list.unshift(action.payload);
            }
            state.comments.total += 1;
        });
        builder.addCase(addComment.rejected, (state, action: PayloadAction<any>) => {
            state.comments.error = action.payload?.error || null;
        });
        builder.addCase(updateComment.fulfilled, (state, action: PayloadAction<any>) => {
            state.comments.list = state.comments.list.map((comment) =>
                comment._id === action.payload._id ? { ...comment, ...action.payload } : comment
            );
        });
        builder.addCase(updateComment.rejected, (state, action: PayloadAction<any>) => {
            state.comments.error = action.payload?.error || null;
        });
        builder.addCase(deleteComment.fulfilled, (state, action: PayloadAction<any>) => {
            state.comments.list = state.comments.list.filter((comment) => comment._id !== action.payload._id);
            state.comments.total -= 1;
        });
        builder.addCase(deleteComment.rejected, (state, action: PayloadAction<any>) => {
            state.comments.error = action.payload?.error || null;
        });
    }
});
export const { resetProjects, resetDocuments, resetEmployees, resetComments } = projectsSlice.actions;
export default projectsSlice.reducer;
