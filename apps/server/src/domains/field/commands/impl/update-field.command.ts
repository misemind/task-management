import { ICommand } from '@nestjs/cqrs';
import { UpdateFieldDto } from '@app/domains/field/dto/update-field.dto';

export class UpdateFieldCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateFieldDto: UpdateFieldDto) {}
}