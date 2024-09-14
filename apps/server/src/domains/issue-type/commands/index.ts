import { CreateIssueTypeHandler } from "./handlers/create-issue-type.handler";
import { DeleteIssueTypeHandler } from "./handlers/delete-issue-type.handler";
import { UpdateIssueTypeHandler } from "./handlers/update-issue-type.handler";

export const IssueTypeCommandHandlers = [
  CreateIssueTypeHandler,
  DeleteIssueTypeHandler,
  UpdateIssueTypeHandler,
];