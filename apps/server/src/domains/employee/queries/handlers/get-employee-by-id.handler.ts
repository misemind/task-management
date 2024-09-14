import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { GetEmployeeByIdQuery } from '@app/domains/employee/queries/impl/get-employee-by-id.query';
import { Employee } from '@app/domains/employee/entities/employee.entity';

@QueryHandler(GetEmployeeByIdQuery)
export class GetEmployeeByIdHandler implements IQueryHandler<GetEmployeeByIdQuery> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(query: GetEmployeeByIdQuery): Promise<Employee | null> {
    return this.employeeRepository.findById(query.id);
  }
}
