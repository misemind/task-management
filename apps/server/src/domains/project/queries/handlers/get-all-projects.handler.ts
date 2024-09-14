import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { GetAllProjectsQuery } from '@app/domains/project/queries/impl/get-all-projects.query';
import { Project } from '@app/domains/project/entities/project.entity';

@QueryHandler(GetAllProjectsQuery)
export class GetAllProjectsHandler implements IQueryHandler<GetAllProjectsQuery> {
  constructor(private readonly projectRepository: ProjectRepository) { }

  async execute(query: GetAllProjectsQuery): Promise<any[]> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    return this.projectRepository.getProjectsWithEmployeeDetails(limit, skip);
  }
}
