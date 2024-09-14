import { ICommand } from '@nestjs/cqrs';
import { UpdateSprintDto } from '@app/domains/sprint/dto/update-sprint.dto';

export class UpdateSprintCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateSprintDto: UpdateSprintDto) {}
}