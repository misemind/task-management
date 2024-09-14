import { CreateIssueHandler } from './handlers/create-issue.handler';
import { DeleteIssueHandler } from './handlers/delete-issue.handler';
import { UpdateIssueHandler } from './handlers/update-issue.handler';

export const IssueCommandHandlers = [
  CreateIssueHandler,
  DeleteIssueHandler,
  UpdateIssueHandler,
];