// ../apps/task-management-service/src/domains/task/events/handlers/tasks-batched.handler.ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TasksBatchedEvent } from '../impl/tasks-batched.event';
// Assume a KafkaService exists for Kafka interactions

import { KafkaService } from '@app/kafka/kafka.service';
import { Logger } from '@app/core/common/logger/logger.service';

@EventsHandler(TasksBatchedEvent)
export class TasksBatchedEventHandler implements IEventHandler<TasksBatchedEvent> {
  constructor(private readonly kafkaService: KafkaService, private readonly logger: Logger) {}

  async handle(event: TasksBatchedEvent): Promise<void> {
    const { tasks, batchNumber } = event;
    this.logger.log(`Publishing batch ${batchNumber} to Kafka`);

    // Publish the batch to Kafka
    await this.kafkaService.sendMessage('task-batch-topic', "tasks");
  }
}
