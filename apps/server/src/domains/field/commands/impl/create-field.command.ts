import { ICommand } from '@nestjs/cqrs';
import { CreateFieldDto } from '@app/domains/field/dto/create-field.dto';

export class CreateFieldCommand implements ICommand {
  constructor(public readonly createFieldDto: CreateFieldDto) {}
}