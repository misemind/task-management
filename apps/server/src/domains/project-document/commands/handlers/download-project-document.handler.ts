import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectDocumentRepository } from '@app/domains/project-document/repositories/project-document.repository';
import { DownloadProjectDocumentCommand } from '@app/domains/project-document/commands/impl/download-project-document.command';
import { NotFoundException, InternalServerErrorException, Inject } from '@nestjs/common';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import * as path from 'path';

import { Readable } from 'stream';  // Import the Node.js Readable stream

@CommandHandler(DownloadProjectDocumentCommand)
export class DownloadProjectDocumentHandler implements ICommandHandler<DownloadProjectDocumentCommand> {
  constructor(
    private readonly projectDocumentRepository: ProjectDocumentRepository,
    private readonly minioService: MinioService,
    @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
  ) { }

  async execute(command: DownloadProjectDocumentCommand): Promise<Readable> {  // Return Node.js Readable stream
    const { id } = command;

    // Query to get the document details from the database
    const document = await this.projectDocumentRepository.findById(id);

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    // Create a read stream from MinIO
    try {
      const documentStream = await this. minioService.downloadFileAsStream(this.config.destinationBucket, document.path);
      return documentStream;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw new InternalServerErrorException('Failed to download document');
    }
  }
}