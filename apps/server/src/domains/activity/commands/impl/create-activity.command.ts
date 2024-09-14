import { ICommand } from '@nestjs/cqrs';
import { CreateActivityDto } from '@app/domains/activity/dto/create-activity.dto';

export class CreateActivityCommand implements ICommand {
  constructor(public readonly createActivityDto: CreateActivityDto) {}
}