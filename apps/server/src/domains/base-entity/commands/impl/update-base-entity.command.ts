import { ICommand } from '@nestjs/cqrs';
import { UpdateBaseEntityDto } from '@app/domains/base-entity/dto/update-base-entity.dto';

export class UpdateBaseEntityCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateBaseEntityDto: UpdateBaseEntityDto) {}
}