// apps/server/src/domains/project/queries/handlers/get-total-projects-count.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { GetTotalProjectsCountQuery } from '@app/domains/project/queries/impl/get-total-projects-count.query';

@QueryHandler(GetTotalProjectsCountQuery)
export class GetTotalProjectsCountHandler implements IQueryHandler<GetTotalProjectsCountQuery> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(query: GetTotalProjectsCountQuery): Promise<number> {
    return this.projectRepository.countProjects();
  }
}
