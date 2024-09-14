import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '@app/domains/activity/repositories/activity.repository';
import { Activity } from '@app/domains/activity/entities/activity.entity';
import { CreateActivityCommand } from '@app/domains/activity/commands/impl/create-activity.command';

@CommandHandler(CreateActivityCommand)
export class CreateActivityHandler implements ICommandHandler<CreateActivityCommand> {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(command: CreateActivityCommand): Promise<Activity> {
    return this.activityRepository.create(command.createActivityDto);
  }
}