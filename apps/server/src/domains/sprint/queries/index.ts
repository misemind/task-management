import { GetSprintByIdHandler } from './handlers/get-sprint-by-id.handler';
import { GetSprintsByProjectIdHandler } from './handlers/get-sprints-by-project-id.handler';

export const SprintQueryHandlers = [
  GetSprintByIdHandler,
  GetSprintsByProjectIdHandler,
];