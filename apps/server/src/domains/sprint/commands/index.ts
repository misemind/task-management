import { CreateSprintHandler } from './handlers/create-sprint.handler';
import { DeleteSprintHandler } from './handlers/delete-sprint.handler';
import { UpdateSprintHandler } from './handlers/update-sprint.handler';

export const SprintCommandHandlers = [
  CreateSprintHandler,
  DeleteSprintHandler,
  UpdateSprintHandler,
];