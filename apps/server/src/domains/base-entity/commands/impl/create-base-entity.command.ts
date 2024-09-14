import { ICommand } from '@nestjs/cqrs';
import { CreateBaseEntityDto } from '@app/domains/base-entity/dto/create-base-entity.dto';

export class CreateBaseEntityCommand implements ICommand {
  constructor(public readonly createBaseEntityDto: CreateBaseEntityDto) {}
}