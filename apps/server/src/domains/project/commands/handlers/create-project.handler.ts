import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { CreateProjectCommand } from '@app/domains/project/commands/impl/create-project.command';
import { Project } from '@app/domains/project/entities/project.entity';
import { Inject, Injectable } from '@nestjs/common';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { Logger } from '@app/core/common/logger/logger.service';
import { CreateProjectDocumentDto } from '@app/domains/project-document/dto/create-project-document.dto';
import { ProjectDocumentService } from '@app/domains/project-document/services/project-document.service';

@CommandHandler(CreateProjectCommand)
@Injectable()
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly minioService: MinioService,
    private readonly projectDocumentService: ProjectDocumentService,
    @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
    private readonly logger: Logger,
  ) {}

  async execute(command: CreateProjectCommand): Promise<Project> {
    const { createProjectDto } = command;
    this.logger.log(`Creating a new project with data: ${JSON.stringify(createProjectDto)}`);

    // Create the project in the database
    const createdProject = await this.projectRepository.create(createProjectDto);

    const { thumbnailImage, files } = createProjectDto;

    // Handle thumbnail image
    if (thumbnailImage) {
      const thumbnailDestinationPath = `${this.config.destinationEntityFolder}/${createdProject._id}/thumbnail/${this.extractFileName(thumbnailImage)}`;
      await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket, thumbnailImage, thumbnailDestinationPath);
      createdProject.thumbnailImage = `${this.config.destinationBucket}/${thumbnailDestinationPath}`;
      this.logger.log(`Thumbnail image moved to: ${thumbnailDestinationPath}`);
    }

    // Handle files array
    if (files && files.length > 0) {
      for (const file of files) {
        const createProjectDocumentDto = new CreateProjectDocumentDto();
        createProjectDocumentDto.name = file.fileName;
        createProjectDocumentDto.path = file.filePath;
        createProjectDocumentDto.projectId = createdProject._id;
        createProjectDocumentDto.size = file.fileSize;
        createProjectDocumentDto.type = file.fileExtension;
        await this.projectDocumentService.createProjectDocument(createProjectDocumentDto);
      }
    }

    const updatedProject = await this.projectRepository.update(createdProject._id, createdProject);
    this.logger.log(`Project created successfully with ID: ${createdProject._id}`);

    return updatedProject;
  }

  private extractFileName(filePath: string): string {
    return filePath.split('/').pop();
  }
}
