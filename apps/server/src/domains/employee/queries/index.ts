import { GetAllEmployeesHandler } from './handlers/get-all-employees.handler';
import { GetEmployeeByIdHandler } from './handlers/get-employee-by-id.handler';
import { GetTotalEmployeesCountHandler } from './impl/get-total-employees-count.handler';

export const EmployeeQueryHandlers = [
  GetAllEmployeesHandler,
  GetEmployeeByIdHandler,
  GetTotalEmployeesCountHandler,
];
