import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeDocumentRepository } from '@app/domains/employee-document/repositories/employee-document.repository';
import { DeleteEmployeeDocumentCommand } from '@app/domains/employee-document/commands/impl/delete-employee-document.command';
import { EmployeeDocument } from '@app/domains/employee-document/entities/employee-document.entity';
// Adjust the import path accordingly
import { NotFoundException, Inject } from '@nestjs/common';
import { DocumentService } from '@app/core/common/services/document.service';

@CommandHandler(DeleteEmployeeDocumentCommand)
export class DeleteEmployeeDocumentHandler implements ICommandHandler<DeleteEmployeeDocumentCommand> {
  constructor(
    private readonly employeeDocumentRepository: EmployeeDocumentRepository,
    private readonly documentService: DocumentService,
  ) {}

  async execute(command: DeleteEmployeeDocumentCommand): Promise<EmployeeDocument | null> {
    const document = await this.employeeDocumentRepository.findById(command.id);
    
    if (!document) {
      throw new NotFoundException(`Document with id ${command.id} not found`);
    }

    // Delete the document from MinIO
    const entityType = 'employees'; // or any other entity type based on your structure
    await this.documentService.deleteDocument(document.path);

    // Delete the document from the database
    return await this.employeeDocumentRepository.delete(command.id);
  }
}
