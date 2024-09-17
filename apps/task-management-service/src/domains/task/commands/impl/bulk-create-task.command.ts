import { ICommand } from '@nestjs/cqrs';
import { CreateTaskDto } from '../../dto/create-task.dto';

export class BulkCreateTasksCommand implements ICommand {
  constructor(public readonly tasks: CreateTaskDto[]) {}
}