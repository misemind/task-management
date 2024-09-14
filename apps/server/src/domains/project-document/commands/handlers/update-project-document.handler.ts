import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectDocumentRepository } from '@app/domains/project-document/repositories/project-document.repository';
import { UpdateProjectDocumentCommand } from '@app/domains/project-document/commands/impl/update-project-document.command';
import { ProjectDocument } from '@app/domains/project-document/entities/project-document.entity';

@CommandHandler(UpdateProjectDocumentCommand)
export class UpdateProjectDocumentHandler implements ICommandHandler<UpdateProjectDocumentCommand> {
  constructor(private readonly projectDocumentRepository: ProjectDocumentRepository) { }

  async execute(command: UpdateProjectDocumentCommand): Promise<ProjectDocument | null> {
    return this.projectDocumentRepository.update(command.id, command.updateProjectDocumentDto);
  }
}