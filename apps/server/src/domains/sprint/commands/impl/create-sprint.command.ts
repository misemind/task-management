import { ICommand } from '@nestjs/cqrs';
import { CreateSprintDto } from '@app/domains/sprint/dto/create-sprint.dto';

export class CreateSprintCommand implements ICommand {
  constructor(public readonly createSprintDto: CreateSprintDto) {}
}