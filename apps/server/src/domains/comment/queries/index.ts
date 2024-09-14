import { GetAllCommentsHandler } from "./handlers/get-all-comments.handler";
import { GetCommentByIdHandler } from "./handlers/get-comment-by-id.handler";
import { GetCommentsByProjectIdHandler } from "./handlers/get-comments-by-project-id.handler";

export const CommentQueryHandlers = [
    GetAllCommentsHandler,
    GetCommentByIdHandler,
    GetCommentsByProjectIdHandler
];