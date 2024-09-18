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
import { SocketGateway } from '@app/socket/socket.gateway';

@CommandHandler(BulkCreateTasksCommand)
export class BulkCreateTasksHandler implements ICommandHandler<BulkCreateTasksCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
    private readonly taskRepository: TaskRepository,
    private readonly connection: Connection,
    private readonly jobService: JobService,
    private readonly socketGateway: SocketGateway
  ) { }

  async bulkInsertWithRetryAndLogging(tasks: CreateTaskDto[]): Promise<any> {
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();

    let attempts = 0;
    const maxRetries = 3;

    // Prepare bulk operations for MongoDB's bulkWrite method
    const bulkOperations = tasks.map(task => {
      if (task.id) {
        // If there's an id, we perform an upsert (update if exists, insert if not)
        return {
          updateOne: {
            filter: { _id: task.id },  // Assuming task.id is mapped to _id in MongoDB
            update: { $set: task },   // Update the existing task
            upsert: true,  // Insert if the document doesn't exist
          }
        };
      } else {
        // If there's no id, it's an insert
        return {
          insertOne: {
            document: task,  // Insert new document
          }
        };
      }
    });

    try {
      while (attempts < maxRetries) {
        try {
          // Use bulkWrite for both insert and update operations in one call
          const result = await this.taskRepository.bulkWrite(bulkOperations, { session });

          // Commit transaction if successful
          await session.commitTransaction();
          return result;
        } catch (error) {
          attempts++;
          this.logger.error(`Attempt ${attempts}: Bulk operation failed: ${error.message}`, error.stack);

          if (attempts >= maxRetries) {
            // await session.abortTransaction();
            this.logger.log('Max retries reached, aborting transaction.');
            throw new InternalServerErrorException('Bulk operation failed after max retries.');
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
      if (inserted) {
        const job = await this.jobService.getJobById(jobId);
        let updateStatus = {};
        if (batchNumber >= job.totalBatches) {
          updateStatus = {
            status: 'COMPLETED',
          }
        }
        
        // update job:
        await this.jobService.updateJob(job._id, {
          completedTasks: job.completedTasks + tasks.length,
          completedBatches: job.completedBatches + 1,
          completedAt: new Date(),
          ...updateStatus
        });

       
        this.socketGateway.emitJobUpdated(job);
        
        
      }
      // emit socket when Job Updated
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
