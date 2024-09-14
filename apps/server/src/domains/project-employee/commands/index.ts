import { CreateProjectEmployeeHandler } from './handlers/create-project-employee.handler';
import { DeleteProjectEmployeeHandler } from './handlers/delete-project-employee.handler';

export const ProjectEmployeeCommandHandlers = [
  CreateProjectEmployeeHandler,
  DeleteProjectEmployeeHandler,
];