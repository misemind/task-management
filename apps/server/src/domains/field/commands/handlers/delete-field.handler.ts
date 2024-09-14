import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FieldRepository } from '@app/domains/field/repositories/field.repository';
import { DeleteFieldCommand } from '@app/domains/field/commands/impl/delete-field.command';
import { Field } from '@app/domains/field/entities/field.entity';

@CommandHandler(DeleteFieldCommand)
export class DeleteFieldHandler implements ICommandHandler<DeleteFieldCommand> {
  constructor(private readonly fieldRepository: FieldRepository) {}

  async execute(command: DeleteFieldCommand): Promise<Field | null> {
    const { id } = command;
    return this.fieldRepository.delete(id);
  }
}