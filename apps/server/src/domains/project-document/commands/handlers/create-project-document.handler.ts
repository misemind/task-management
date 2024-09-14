// apps/server/src/domains/project-document/commands/handlers/create-project-document.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectDocumentRepository } from '@app/domains/project-document/repositories/project-document.repository';
import { CreateProjectDocumentCommand } from '@app/domains/project-document/commands/impl/create-project-document.command';
import { ProjectDocument } from '@app/domains/project-document/entities/project-document.entity';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { Inject } from '@nestjs/common';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import * as path from 'path';

@CommandHandler(CreateProjectDocumentCommand)
export class CreateProjectDocumentHandler implements ICommandHandler<CreateProjectDocumentCommand> {
    constructor(
        private readonly projectDocumentRepository: ProjectDocumentRepository,
        private readonly minioService: MinioService,
        @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
    ) { }

    async execute(command: CreateProjectDocumentCommand): Promise<ProjectDocument> {
        const { path: filePath, projectId, name, type, size } = command.createProjectDocumentDto;

        // Create the project document in the database
        const createdProjectDocument = await this.projectDocumentRepository.create({
            projectId,
            name,
            type,
            path: filePath,
            size,
        });

        if (filePath) {
            const fileExtension = path.extname(filePath);
            const documentDestinationPath = `${this.config.destinationEntityFolder}/${projectId}/documents/${createdProjectDocument._id}${fileExtension}`;
            await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket, filePath, documentDestinationPath);
            createdProjectDocument.path = `${this.config.destinationBucket}/${documentDestinationPath}`;
        }

        return await this.projectDocumentRepository.update(createdProjectDocument._id, createdProjectDocument);
    }
}
