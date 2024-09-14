import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SprintRepository } from '@app/domains/sprint/repositories/sprint.repository';
import { GetSprintByIdQuery } from '@app/domains/sprint/queries/impl/get-sprint-by-id.query';
import { Sprint } from '@app/domains/sprint/entities/sprint.entity';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetSprintByIdQuery)
export class GetSprintByIdHandler implements IQueryHandler<GetSprintByIdQuery> {
  constructor(private readonly sprintRepository: SprintRepository) {}

  async execute(query: GetSprintByIdQuery): Promise<Sprint | null> {
    const sprint = await this.sprintRepository.findById(query.id);

    if (!sprint) {
      throw new NotFoundException(`Sprint not found with ID: ${query.id}`);
    }

    return sprint;
  }
}