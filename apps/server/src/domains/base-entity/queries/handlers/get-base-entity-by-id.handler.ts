import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BaseEntityRepository } from '@app/domains/base-entity/repositories/base-entity.repository';
import { GetBaseEntityByIdQuery } from '@app/domains/base-entity/queries/impl/get-base-entity-by-id.query';
import { BaseEntity } from '@app/domains/base-entity/entities/base-entity.entity';

@QueryHandler(GetBaseEntityByIdQuery)
export class GetBaseEntityByIdHandler implements IQueryHandler<GetBaseEntityByIdQuery> {
  constructor(private readonly baseEntityRepository: BaseEntityRepository) {}

  async execute(query: GetBaseEntityByIdQuery): Promise<BaseEntity | null> {
    return this.baseEntityRepository.findById(query.id);
  }
}