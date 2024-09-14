import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectEmployeeRepository } from '@app/domains/project-employee/repositories/project-employee.repository';
import { GetProjectsByEmployeeQuery } from '@app/domains/project-employee/queries/impl/get-projects-by-employee.query';
import { ProjectEmployee } from '@app/domains/project-employee/entities/project-employee.entity';


@QueryHandler(GetProjectsByEmployeeQuery)
export class GetProjectsByEmployeeHandler implements IQueryHandler<GetProjectsByEmployeeQuery> {
  constructor(private readonly projectEmployeeRepository: ProjectEmployeeRepository) {}

  async execute(query: GetProjectsByEmployeeQuery): Promise<ProjectEmployee[]> {
    const { employeeId, limit, skip } = query;
    return this.projectEmployeeRepository.findByEmployeeIdWithPagination(employeeId, limit, skip);
  }
}