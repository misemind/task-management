import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectEmployeeRepository } from '@app/domains/project-employee/repositories/project-employee.repository';
import { GetProjectEmployeesByProjectQuery } from '@app/domains/project-employee/queries/impl/get-project-employees-by-project.query';
import { ProjectEmployee } from '@app/domains/project-employee/entities/project-employee.entity';


@QueryHandler(GetProjectEmployeesByProjectQuery)
export class GetProjectEmployeesByProjectHandler implements IQueryHandler<GetProjectEmployeesByProjectQuery> {
  constructor(private readonly projectEmployeeRepository: ProjectEmployeeRepository) {}

  async execute(query: GetProjectEmployeesByProjectQuery): Promise<ProjectEmployee[]> {
    const { projectId, limit, skip } = query;
    return this.projectEmployeeRepository.findByProjectIdWithPagination(projectId, limit, skip);
  }
}