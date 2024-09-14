// apps/server/src/domains/project-employee/queries/handlers/get-total-project-employees-count.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectEmployeeRepository } from '@app/domains/project-employee/repositories/project-employee.repository';
import { GetTotalProjectEmployeesCountQuery } from '@app/domains/project-employee/queries/impl/get-total-project-employees-count.query';

@QueryHandler(GetTotalProjectEmployeesCountQuery)
export class GetTotalProjectEmployeesCountHandler implements IQueryHandler<GetTotalProjectEmployeesCountQuery> {
  constructor(private readonly projectEmployeeRepository: ProjectEmployeeRepository) {}

  async execute(query: GetTotalProjectEmployeesCountQuery): Promise<number> {
    return this.projectEmployeeRepository.countByProjectId(query.projectId);
  }
}
