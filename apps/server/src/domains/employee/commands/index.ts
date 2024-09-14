import { CreateEmployeeHandler } from './handlers/create-employee.handler';
import { DeleteEmployeeHandler } from './handlers/delete-employee.handler';
import { UpdateEmployeeHandler } from './handlers/update-employee.handler';

export const EmployeeCommandHandlers = [
  CreateEmployeeHandler,
  DeleteEmployeeHandler,
  UpdateEmployeeHandler,
];
