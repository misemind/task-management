import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectDocumentRepository } from '@app/domains/project-document/repositories/project-document.repository';
import { DeleteProjectDocumentCommand } from '@app/domains/project-document/commands/impl/delete-project-document.command';
import { ProjectDocument } from '@app/domains/project-document/entities/project-document.entity';
import { NotFoundException, Inject } from '@nestjs/common';
import { DocumentService } from '@app/core/common/services/document.service';


@CommandHandler(DeleteProjectDocumentCommand)
export class DeleteProjectDocumentHandler implements ICommandHandler<DeleteProjectDocumentCommand> {
  constructor(
    private readonly projectDocumentRepository: ProjectDocumentRepository,
    private readonly documentService: DocumentService,
  ) { }

  async execute(command: DeleteProjectDocumentCommand): Promise<ProjectDocument | null> {
    const document = await this.projectDocumentRepository.findById(command.id);

    if (!document) {
      throw new NotFoundException(`Document with id ${command.id} not found`);
    }

    // Delete the document from MinIO
    await this.documentService.deleteDocument(document.path);

    // Delete the document from the database
    return await this.projectDocumentRepository.delete(command.id);
  }
}