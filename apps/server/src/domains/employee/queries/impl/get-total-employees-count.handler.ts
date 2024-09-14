// apps/server/src/domains/employee/queries/handlers/get-total-employees-count.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { GetTotalEmployeesCountQuery } from '@app/domains/employee/queries/handlers/get-total-employees-count.query';


@QueryHandler(GetTotalEmployeesCountQuery)
export class GetTotalEmployeesCountHandler implements IQueryHandler<GetTotalEmployeesCountQuery> {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(query: GetTotalEmployeesCountQuery): Promise<number> {
    return this.employeeRepository.countEmployees();
  }
}
