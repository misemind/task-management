import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TaskRepository } from '@app/domains/task/repositories/task.repository';
import { Task } from '@app/domains/task/entities/task.entity';
import { GetAllTasksQuery } from '@app/domains/task/queries/impl/get-all-tasks.query';

@QueryHandler(GetAllTasksQuery)
export class GetAllTasksHandler implements IQueryHandler<GetAllTasksQuery> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(query: GetAllTasksQuery): Promise<Task[]> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    return this.taskRepository.findAll(limit, skip);
  }
}