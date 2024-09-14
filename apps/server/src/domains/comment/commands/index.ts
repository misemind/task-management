import { CreateCommentHandler } from './handlers/create-comment.handler';
import { DeleteCommentHandler } from './handlers/delete-comment.handler';
import { UpdateCommentHandler } from './handlers/update-comment.handler';

export const CommentCommandHandlers = [
  CreateCommentHandler,
  DeleteCommentHandler,
  UpdateCommentHandler,
];