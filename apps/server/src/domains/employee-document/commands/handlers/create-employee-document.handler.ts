import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeDocumentRepository } from '@app/domains/employee-document/repositories/employee-document.repository';
import { CreateEmployeeDocumentCommand } from '@app/domains/employee-document/commands/impl/create-employee-document.command';
import { EmployeeDocument } from '@app/domains/employee-document/entities/employee-document.entity';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { Inject } from '@nestjs/common';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import * as path from 'path';
@CommandHandler(CreateEmployeeDocumentCommand)
export class CreateEmployeeDocumentHandler implements ICommandHandler<CreateEmployeeDocumentCommand> {
  constructor(
    private readonly employeeDocumentRepository: EmployeeDocumentRepository,
    private readonly minioService: MinioService,
    @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
  ) {}

  async execute(command: CreateEmployeeDocumentCommand): Promise<EmployeeDocument> {
    const { path:filePath, employeeId, name, type, size } = command.createEmployeeDocumentDto;

    // Create the employee document in the database
    const createdEmployeeDocument = await this.employeeDocumentRepository.create({
      employeeId,
      name,
      type,
      path: filePath,
      size,
    });

    if (filePath) {
      const fileExtension = path.extname(filePath);
      const documentDestinationPath = `${this.config.destinationEntityFolder}/${employeeId}/documents/${createdEmployeeDocument._id}${fileExtension}`;
      await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket,filePath, documentDestinationPath);
      createdEmployeeDocument.path = documentDestinationPath;
    }

    return await this.employeeDocumentRepository.update(createdEmployeeDocument._id, createdEmployeeDocument);
  }
}
