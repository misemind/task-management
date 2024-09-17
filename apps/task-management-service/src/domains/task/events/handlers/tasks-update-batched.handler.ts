// ../apps/task-management-service/src/domains/task/events/handlers/tasks-update-batched.handler.ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TasksUpdateBatchedEvent } from '../impl/tasks-update-batched.event';


import { KafkaService } from '@app/kafka/kafka.service';
import { Logger } from '@app/core/common/logger/logger.service';

@EventsHandler(TasksUpdateBatchedEvent)
export class TasksUpdateBatchedEventHandler implements IEventHandler<TasksUpdateBatchedEvent> {
  constructor(private readonly kafkaService: KafkaService, private readonly logger: Logger) {}

  async handle(event: TasksUpdateBatchedEvent): Promise<void> {
    const { tasks, batchNumber } = event;
    this.logger.log(`Publishing update batch ${batchNumber} to Kafka`);

    // Publish the batch of updates to Kafka
    await this.kafkaService.sendMessage('task-update-batch-topic', "tasks");
  }
}
