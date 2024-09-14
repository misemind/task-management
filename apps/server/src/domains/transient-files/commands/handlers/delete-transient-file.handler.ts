import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransientFileRepository } from '@app/domains/transient-files/repositories/transient-file.repository';
import { DeleteTransientFileCommand } from '@app/domains/transient-files/commands/impl/delete-transient-file.command';
import { TransientFile } from '@app/domains/transient-files/entities/transient-file.entity';

@CommandHandler(DeleteTransientFileCommand)
export class DeleteTransientFileHandler implements ICommandHandler<DeleteTransientFileCommand> {
  constructor(private readonly transientFileRepository: TransientFileRepository) {}

  async execute(command: DeleteTransientFileCommand): Promise<TransientFile | null> {
    const { id } = command;
    return this.transientFileRepository.delete(id);
  }
}
