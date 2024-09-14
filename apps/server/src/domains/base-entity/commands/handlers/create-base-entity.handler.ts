// apps/server/src/domains/base-entity/commands/handlers/create-base-entity.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseEntityRepository } from '@app/domains/base-entity/repositories/base-entity.repository';
import { BaseEntity } from '@app/domains/base-entity/entities/base-entity.entity';
import { CreateBaseEntityCommand } from '@app/domains/base-entity/commands/impl/create-base-entity.command';

@CommandHandler(CreateBaseEntityCommand)
export class CreateBaseEntityHandler implements ICommandHandler<CreateBaseEntityCommand> {
  constructor(private readonly baseEntityRepository: BaseEntityRepository) {}

  async execute(command: CreateBaseEntityCommand): Promise<BaseEntity> {
    return this.baseEntityRepository.create(command.createBaseEntityDto);
  }
}
