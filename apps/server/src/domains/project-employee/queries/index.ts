import { GetProjectEmployeesByProjectHandler } from './handlers/get-project-employees-by-project.handler';
import { GetProjectsByEmployeeHandler } from './handlers/get-projects-by-employee.handler';
import { GetTotalEmployeeProjectsCountHandler } from './handlers/get-total-employee-projects-count.handler';
import { GetTotalProjectEmployeesCountHandler } from './handlers/get-total-project-employees-count.handler';

export const ProjectEmployeeQueryHandlers = [
  GetProjectEmployeesByProjectHandler,
  GetProjectsByEmployeeHandler,
  GetTotalProjectEmployeesCountHandler,
  GetTotalEmployeeProjectsCountHandler,
];