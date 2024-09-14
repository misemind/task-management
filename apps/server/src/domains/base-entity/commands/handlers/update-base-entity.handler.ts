import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseEntityRepository } from '@app/domains/base-entity/repositories/base-entity.repository';
import { UpdateBaseEntityCommand } from '@app/domains/base-entity/commands/impl/update-base-entity.command';
import { BaseEntity } from '@app/domains/base-entity/entities/base-entity.entity';

@CommandHandler(UpdateBaseEntityCommand)
export class UpdateBaseEntityHandler implements ICommandHandler<UpdateBaseEntityCommand> {
  constructor(private readonly baseEntityRepository: BaseEntityRepository) {}

  async execute(command: UpdateBaseEntityCommand): Promise<BaseEntity | null> {
    return this.baseEntityRepository.update(command.id, command.updateBaseEntityDto);
  }
}