import { ICommand } from '@nestjs/cqrs';
import { UpdateActivityDto } from '@app/domains/activity/dto/update-activity.dto';

export class UpdateActivityCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateActivityDto: UpdateActivityDto) {}
}