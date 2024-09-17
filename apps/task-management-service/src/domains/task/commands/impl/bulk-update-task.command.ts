// ../apps/task-management-service/src/domains/task/commands/impl/bulk-update-task.command.ts
import { ICommand } from '@nestjs/cqrs';
import { UpdateTaskDto } from '../../dto/update-task.dto';

export class BulkUpdateTasksCommand implements ICommand {
  constructor(public readonly tasks: UpdateTaskDto[]) {}
}
