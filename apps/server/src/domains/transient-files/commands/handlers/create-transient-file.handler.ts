import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransientFileRepository } from '@app/domains/transient-files/repositories/transient-file.repository';
import { CreateTransientFileCommand } from '@app/domains/transient-files/commands/impl/create-transient-file.command';
import { TransientFile } from '@app/domains/transient-files/entities/transient-file.entity';

@CommandHandler(CreateTransientFileCommand)
export class CreateTransientFileHandler implements ICommandHandler<CreateTransientFileCommand> {
  constructor(private readonly transientFileRepository: TransientFileRepository) {}

  async execute(command: CreateTransientFileCommand): Promise<TransientFile> {
    const { filePath, expiresAt } = command;
    return this.transientFileRepository.create(filePath, expiresAt);
  }
}
