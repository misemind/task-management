import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { UpdateProjectCommand } from '@app/domains/project/commands/impl/update-project.command';
import { Project } from '@app/domains/project/entities/project.entity';
import { Inject, NotFoundException, Injectable } from '@nestjs/common';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { Logger } from '@app/core/common/logger/logger.service';
import { CreateProjectDocumentDto } from '@app/domains/project-document/dto/create-project-document.dto';
import { ProjectDocumentService } from '@app/domains/project-document/services/project-document.service';

@CommandHandler(UpdateProjectCommand)
@Injectable()
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly minioService: MinioService,
    private readonly projectDocumentService: ProjectDocumentService,
    @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
    private readonly logger: Logger,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<Project | null> {
    this.logger.log(`Updating project with ID: ${command.id}`);

    const existingProject = await this.projectRepository.findById(command.id);

    if (!existingProject) {
      this.logger.warn(`Project not found with ID: ${command.id}`);
      throw new NotFoundException('Project not found');
    }

    const updateData = { ...existingProject, ...command.updateProjectDto };

    const { thumbnailImage, files } = command.updateProjectDto;

    // Handle thumbnail image update
    if (thumbnailImage && thumbnailImage !== existingProject.thumbnailImage) {
      const thumbnailDestinationPath = `${this.config.destinationEntityFolder}/${existingProject._id}/thumbnail/${this.extractFileName(thumbnailImage)}`;

      if (existingProject.thumbnailImage) {
        const objectPath = this.extractObjectPath(existingProject.thumbnailImage);
        await this.minioService.deleteFile(this.config.destinationBucket, objectPath);
        this.logger.log(`Deleted old thumbnail image: ${objectPath}`);
      }

      await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket, thumbnailImage, thumbnailDestinationPath);
      updateData.thumbnailImage = `${this.config.destinationBucket}/${thumbnailDestinationPath}`;
      this.logger.log(`Thumbnail image updated and moved to: ${thumbnailDestinationPath}`);
    }

    // Handle files array
    if (files && files.length > 0) {
      for (const file of files) {
        const createProjectDocumentDto = new CreateProjectDocumentDto();
        createProjectDocumentDto.name = file.fileName;
        createProjectDocumentDto.path = file.filePath;
        createProjectDocumentDto.projectId = existingProject._id;
        createProjectDocumentDto.size = file.fileSize;
        createProjectDocumentDto.type = file.fileExtension;
        await this.projectDocumentService.createProjectDocument(createProjectDocumentDto);
      }
    }

    const updatedProject = await this.projectRepository.update(existingProject._id, updateData);
    this.logger.log(`Project updated successfully with ID: ${existingProject._id}`);

    return updatedProject;
  }

  private extractFileName(filePath: string): string {
    return filePath.split('/').pop();
  }

  private extractObjectPath(fullPath: string): string {
    const pathParts = fullPath.split('/');
    pathParts.shift(); // Remove the bucket name
    return pathParts.join('/');
  }
}
