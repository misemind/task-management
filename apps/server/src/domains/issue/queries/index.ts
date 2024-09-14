import { GetIssueByIdHandler } from './handlers/get-issue-by-id.handler';
import { GetIssuesByProjectIdHandler } from './handlers/get-issues-by-project-id.handler';

export const IssueQueryHandlers = [
  GetIssueByIdHandler,
  GetIssuesByProjectIdHandler,
];