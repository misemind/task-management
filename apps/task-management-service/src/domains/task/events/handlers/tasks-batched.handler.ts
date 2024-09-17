// ../apps/task-management-service/src/domains/task/events/handlers/tasks-batched.handler.ts
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TasksBatchedEvent } from '../impl/tasks-batched.event';
import { KafkaService } from '@app/kafka/kafka.service';
import { JobService } from '@app/domains/job/services/job.service'; // Import the JobService to create/update Job entity
import { Logger } from '@app/core/common/logger/logger.service';
import { CreateJobDto } from '@app/domains/job/dto/create-job.dto';

@EventsHandler(TasksBatchedEvent)
export class TasksBatchedEventHandler implements IEventHandler<TasksBatchedEvent> {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly jobService: JobService, // Inject JobService
    private readonly logger: Logger
  ) {}

  async handle(event: TasksBatchedEvent): Promise<void> {
    const { tasks, batchNumber } = event;
    this.logger.log(`Processing batch ${batchNumber} for task creation...`);

    // Step 1: Create Job entity
    const createJobDto: CreateJobDto = {
        jobId: `job-${Date.now()}`,
        totalTasks: tasks.length,
        totalBatches: 1,
        completedTasks: 0,
        failedTasks: 0,
        completedBatches: 0,
        failedBatches: 0,
        status: 'IN_PROGRESS',
        createdAt: new Date(),
        batchErrors: []
    };

    const job = await this.jobService.createJob(createJobDto); // Create the Job entity
    this.logger.log(`Job created with ID: ${job.jobId}`);

    try {
      // Step 2: Publish the batch to Kafka and handle response
      const response = await this.kafkaService.publish('task-batch-topic', tasks);
      this.logger.log(`Successfully published batch ${batchNumber} to Kafka, response: ${response}`);

      // Step 3: Update Job entity on success
      await this.jobService.updateJob(job.jobId, {
        completedTasks: tasks.length,
        completedBatches: 1,
        status: 'COMPLETED',
        completedAt: new Date(),
      });
      this.logger.log(`Job updated with success for batch ${batchNumber}`);
    } catch (error) {
      // Step 4: Handle failure and update Job entity
      this.logger.error(`Failed to publish batch ${batchNumber}: ${error.message}`);
      await this.jobService.updateJob(job.jobId, {
        failedTasks: tasks.length,
        failedBatches: 1,
        status: 'FAILED',
        batchErrors: [{ batchNumber, error: error.message, timestamp: new Date() }],
      });
    }
  }
}
