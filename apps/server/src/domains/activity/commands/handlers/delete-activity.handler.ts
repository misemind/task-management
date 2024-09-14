import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '@app/domains/activity/repositories/activity.repository';
import { DeleteActivityCommand } from '@app/domains/activity/commands/impl/delete-activity.command';
import { Activity } from '@app/domains/activity/entities/activity.entity';

@CommandHandler(DeleteActivityCommand)
export class DeleteActivityHandler implements ICommandHandler<DeleteActivityCommand> {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(command: DeleteActivityCommand): Promise<Activity | null> {
    return this.activityRepository.delete(command.id);
  }
}