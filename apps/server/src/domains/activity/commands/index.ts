import { CreateActivityHandler } from './handlers/create-activity.handler';
import { DeleteActivityHandler } from './handlers/delete-activity.handler';
import { UpdateActivityHandler } from './handlers/update-activity.handler';

export const ActivityCommandHandlers = [
  CreateActivityHandler,
  DeleteActivityHandler,
  UpdateActivityHandler,
];