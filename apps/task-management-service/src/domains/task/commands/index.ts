import { CreateTaskHandler } from './handlers/create-task.handler';
import { DeleteTaskHandler } from './handlers/delete-task.handler';
import { UpdateTaskHandler } from './handlers/update-task.handler';

export const TaskCommandHandlers = [
  CreateTaskHandler,
  DeleteTaskHandler,
  UpdateTaskHandler,
];