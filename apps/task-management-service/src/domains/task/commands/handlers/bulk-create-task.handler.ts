import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BulkCreateTaskCommand } from '../impl/bulk-create-task.command';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { Connection, ClientSession } from 'mongoose';
import { TaskRepository } from '../../repositories/task.repository';
import { Logger } from '@app/core/common/logger/logger.service';
import { parseExcelToJson } from '@app/domains/shared/utils/excel.util';

@CommandHandler(BulkCreateTaskCommand)
export class BulkCreateTaskHandler implements ICommandHandler<BulkCreateTaskCommand> {
  constructor(
    private readonly connection: Connection,
    private readonly taskRepository: TaskRepository,
    private readonly logger: Logger
  ) {}

  async execute(command: BulkCreateTaskCommand): Promise<any> {
    const { fileBuffer } = command;  // Assuming fileBuffer is passed in the command

    // Convert Excel buffer to JSON using the utility function
    console.log(fileBuffer,'@#@#@#');
    const tasks: CreateTaskDto[] = parseExcelToJson(fileBuffer);
    console.log(tasks,'@#@#@#');

    // Call the method to bulk insert the tasks with transaction management
    return this.bulkInsertWithRetryAndLogging(tasks);
  }

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
}
