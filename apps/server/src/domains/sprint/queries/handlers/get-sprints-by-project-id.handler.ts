import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SprintRepository } from '@app/domains/sprint/repositories/sprint.repository';
import { GetSprintsByProjectIdQuery } from '@app/domains/sprint/queries/impl/get-sprints-by-project-id.query';
import { Sprint } from '@app/domains/sprint/entities/sprint.entity';

@QueryHandler(GetSprintsByProjectIdQuery)
export class GetSprintsByProjectIdHandler implements IQueryHandler<GetSprintsByProjectIdQuery> {
  constructor(private readonly sprintRepository: SprintRepository) {}

  async execute(query: GetSprintsByProjectIdQuery): Promise<Sprint[]> {
    const { projectId, limit, page } = query;
    const skip = (page - 1) * limit;

    return this.sprintRepository.findByProjectIdWithPagination(projectId, limit, skip);
  }
}