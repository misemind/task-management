import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { BulkCreateTasksCommand } from '../impl/bulk-create-task.command';
import { TasksUpdateBatchedEvent } from '../../events/impl/tasks-update-batched.event';
import { Logger } from '@app/core/common/logger/logger.service';
import { parseCsvToJson, parseXlsxToJson } from '@app/domains/shared/utils/excel.util';
import { TaskRepository } from '../../repositories/task.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { Connection, ClientSession } from 'mongoose';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { JobService } from '@app/domains/job/services/job.service';

@CommandHandler(BulkCreateTasksCommand)
export class BulkCreateTasksHandler implements ICommandHandler<BulkCreateTasksCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
    private readonly taskRepository: TaskRepository,
    private readonly connection: Connection,
    private readonly jobService: JobService,
  ) { }

  async bulkInsertWithRetryAndLogging(tasks: CreateTaskDto[]): Promise<any> {
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    let attempts = 0;
    const maxRetries = 3;

    try {
      while (attempts < maxRetries) {
        try {
          const result = await this.taskRepository.insertMany(tasks, { session });
          await session.commitTransaction();
          return result;
        } catch (error) {
          attempts++;
          this.logger.error(`Attempt ${attempts}: Bulk insert failed: ${error.message}`, error.stack);

          if (attempts >= maxRetries) {
            await session.abortTransaction();
            this.logger.log('Max retries reached, aborting transaction.');
            throw new InternalServerErrorException('Bulk insert failed after max retries.');
          }
        }
      }
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Transaction aborted due to error: ', error.stack);
      throw new InternalServerErrorException('Bulk operation failed.');
    } finally {
      session.endSession();
    }
  }

  async execute(command: BulkCreateTasksCommand): Promise<void> {
    const { tasks, jobId, batchNumber } = command;
    try {
      const inserted = await this.bulkInsertWithRetryAndLogging(tasks);
      if (inserted && inserted.length > 0) {
        const job = await this.jobService.getJobById(jobId);
        let updateStatus = {};
        if (batchNumber >= job.totalBatches) {
          updateStatus = {
            status: 'COMPLETED',
          }
        }
        // update job:
        await this.jobService.updateJob(job._id, {
          completedTasks: tasks.length,
          completedBatches: batchNumber,
          completedAt: new Date(),
          ...updateStatus
        });
      }
      return inserted;

    } catch (error) {
      this.logger.error(`Failed to publish batch ${batchNumber}: ${error.message}`);
      await this.jobService.updateJob(jobId, {
        failedTasks: tasks.length,
        failedBatches: 1,
        status: 'FAILED',
        batchErrors: [{ batchNumber, error: error.message, timestamp: new Date() }],
      });
    }

  }
}
