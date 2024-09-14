import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FieldRepository } from '@app/domains/field/repositories/field.repository';
import { CreateFieldCommand } from '@app/domains/field/commands/impl/create-field.command';
import { Field } from '@app/domains/field/entities/field.entity';
import { Injectable } from '@nestjs/common';

@CommandHandler(CreateFieldCommand)
@Injectable()
export class CreateFieldHandler implements ICommandHandler<CreateFieldCommand> {
  constructor(private readonly fieldRepository: FieldRepository) {}

  async execute(command: CreateFieldCommand): Promise<Field> {
    const { createFieldDto } = command;
    const createdField = await this.fieldRepository.create(createFieldDto);
    return createdField;
  }
}