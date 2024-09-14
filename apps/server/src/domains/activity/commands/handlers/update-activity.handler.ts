import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '@app/domains/activity/repositories/activity.repository';
import { UpdateActivityCommand } from '@app/domains/activity/commands/impl/update-activity.command';
import { Activity } from '@app/domains/activity/entities/activity.entity';

@CommandHandler(UpdateActivityCommand)
export class UpdateActivityHandler implements ICommandHandler<UpdateActivityCommand> {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(command: UpdateActivityCommand): Promise<Activity | null> {
    return this.activityRepository.update(command.id, command.updateActivityDto);
  }
}