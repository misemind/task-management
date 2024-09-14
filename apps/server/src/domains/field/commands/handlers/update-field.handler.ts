import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FieldRepository } from '@app/domains/field/repositories/field.repository';
import { UpdateFieldCommand } from '@app/domains/field/commands/impl/update-field.command';
import { Field } from '@app/domains/field/entities/field.entity';
import { NotFoundException, Injectable } from '@nestjs/common';

@CommandHandler(UpdateFieldCommand)
@Injectable()
export class UpdateFieldHandler implements ICommandHandler<UpdateFieldCommand> {
  constructor(private readonly fieldRepository: FieldRepository) {}

  async execute(command: UpdateFieldCommand): Promise<Field | null> {
    const existingField = await this.fieldRepository.findById(command.id);

    if (!existingField) {
      throw new NotFoundException('Field not found');
    }

    const updatedField = await this.fieldRepository.update(command.id, command.updateFieldDto);
    return updatedField;
  }
}