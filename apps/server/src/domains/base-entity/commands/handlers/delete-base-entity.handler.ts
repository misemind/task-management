import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseEntityRepository } from '@app/domains/base-entity/repositories/base-entity.repository';
import { DeleteBaseEntityCommand } from '@app/domains/base-entity/commands/impl/delete-base-entity.command';
import { BaseEntity } from '@app/domains/base-entity/entities/base-entity.entity';

@CommandHandler(DeleteBaseEntityCommand)
export class DeleteBaseEntityHandler implements ICommandHandler<DeleteBaseEntityCommand> {
  constructor(private readonly baseEntityRepository: BaseEntityRepository) {}

  async execute(command: DeleteBaseEntityCommand): Promise<BaseEntity | null> {
    return this.baseEntityRepository.delete(command.id);
  }
}