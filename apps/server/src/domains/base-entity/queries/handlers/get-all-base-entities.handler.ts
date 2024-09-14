import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BaseEntityRepository } from '@app/domains/base-entity/repositories/base-entity.repository';
import { BaseEntity } from '@app/domains/base-entity/entities/base-entity.entity';
import { GetAllBaseEntitiesQuery } from '@app/domains/base-entity/queries/impl/get-all-base-entities.query';

@QueryHandler(GetAllBaseEntitiesQuery)
export class GetAllBaseEntitiesHandler implements IQueryHandler<GetAllBaseEntitiesQuery> {
  constructor(private readonly baseEntityRepository: BaseEntityRepository) {}

  async execute(query: GetAllBaseEntitiesQuery): Promise<BaseEntity[]> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    return this.baseEntityRepository.findAll(limit, skip);
  }
}