// ../apps/task-management-service/src/domains/task/commands/handlers/bulk-update-task.handler.ts
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { BulkUpdateTasksCommand } from '../impl/bulk-update-task.command';
import { TasksUpdateBatchedEvent } from '../../events/impl/tasks-update-batched.event';
import { Logger } from '@app/core/common/logger/logger.service';


@CommandHandler(BulkUpdateTasksCommand)
export class BulkUpdateTasksHandler implements ICommandHandler<BulkUpdateTasksCommand> {
  constructor(private readonly eventBus: EventBus, private readonly logger: Logger) {}

  async execute(command: BulkUpdateTasksCommand): Promise<void> {
    const { tasks } = command;
    const batchSize = 100; // Process 100 tasks per batch
    const batches = [];

    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      batches.push(batch);
    }

    // Emit an event for each batch
    batches.forEach((batch, index) => {
      this.logger.log(`Emitting TasksUpdateBatchedEvent for batch ${index + 1}`);
      this.eventBus.publish(new TasksUpdateBatchedEvent(batch, index + 1));
    });
  }
}
