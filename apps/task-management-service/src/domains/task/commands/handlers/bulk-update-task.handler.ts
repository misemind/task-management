import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskService } from '../../services/task.service';
import { BulkUpdateTaskCommand } from '../impl/bulk-update-task.command';

@CommandHandler(BulkUpdateTaskCommand)
export class BulkUpdateTaskHandler implements ICommandHandler<BulkUpdateTaskCommand> {
  constructor(private readonly taskService: TaskService) {}

  async execute(command: BulkUpdateTaskCommand): Promise<any> {
    // return this.taskService.bulkUpdateTasks(command.tasks);
  }
}