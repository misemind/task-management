import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { Employee } from '@app/domains/employee/entities/employee.entity';
import { GetAllEmployeesQuery } from '@app/domains/employee/queries/impl/get-all-employees.query';

@QueryHandler(GetAllEmployeesQuery)
export class GetAllEmployeesHandler implements IQueryHandler<GetAllEmployeesQuery> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(query: GetAllEmployeesQuery): Promise<Employee[]> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    return this.employeeRepository.findAll(limit, skip);
  }
}
