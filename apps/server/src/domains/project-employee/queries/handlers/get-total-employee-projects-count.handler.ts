
// apps/server/src/domains/project-employee/queries/handlers/get-total-employee-projects-count.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectEmployeeRepository } from '@app/domains/project-employee/repositories/project-employee.repository';
import { GetTotalEmployeeProjectsCountQuery } from '@app/domains/project-employee/queries/impl/get-total-employee-projects-count.query';


@QueryHandler(GetTotalEmployeeProjectsCountQuery)
export class GetTotalEmployeeProjectsCountHandler implements IQueryHandler<GetTotalEmployeeProjectsCountQuery> {
  constructor(private readonly projectEmployeeRepository: ProjectEmployeeRepository) {}

  async execute(query: GetTotalEmployeeProjectsCountQuery): Promise<number> {
    return this.projectEmployeeRepository.countByEmployeeId(query.employeeId);
  }
}
