import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { DeleteProjectCommand } from '@app/domains/project/commands/impl/delete-project.command';
import { Project } from '@app/domains/project/entities/project.entity';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: DeleteProjectCommand): Promise<Project | null> {
    const { id } = command;
    return this.projectRepository.delete(id);
  }
}
