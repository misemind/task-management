// apps/server/src/domains/comment/commands/handlers/create-comment.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '@app/domains/comment/repositories/comment.repository';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { CreateCommentCommand } from '@app/domains/comment/commands/impl/create-comment.command';
import { Comment } from '@app/domains/comment/entities/comment.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeRepository } from '@app/domains/employee/repositories/employee.repository';
import { MinioService } from '@app/infrastructure/cloud/minio/minio.service';
import { StorageConfig } from '@app/core/common/interfaces/storage-config.interface';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateCommentCommand)
@Injectable()
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly minioService: MinioService,
    @Inject('STORAGE_CONFIG') private readonly config: StorageConfig,
  ) {}

  async execute(command: CreateCommentCommand): Promise<Comment> {
    const { projectId, userId, content, parentId, files } = command;

    // If userId is not provided, use a random employee for testing purposes
    const user = userId 
      ? await this.employeeRepository.findById(userId) 
      : await this.employeeRepository.findDefaultUser();  // Get a random user

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify that the project exists
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Handle file uploads directly
    let uploadedFiles = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const destinationPath = `${this.config.destinationEntityFolder}/${projectId}/comments/${this.extractFileName(file.url)}`;
        await this.minioService.moveFile(this.config.sourceBucket, this.config.destinationBucket, file.url, destinationPath);
        uploadedFiles.push({
          ...file,
          url: `${this.config.destinationBucket}/${destinationPath}`
        });
      }
    }

    // Create the new comment
    const newComment = await this.commentRepository.create({
      projectId,
      userId: user._id,
      content,
      parentId,
      files: uploadedFiles, // Add files to the comment
    });

    // If this comment is a reply, update the parent comment
    if (parentId) {
      await this.commentRepository.addReply(parentId, newComment._id);
    }

    // Add the comment ID to the project's commentIds array
    project.commentIds.push(newComment._id.toString());
    await this.projectRepository.update(projectId, project);

    return newComment;
  }

  private extractFileName(filePath: string): string {
    return filePath.split('/').pop();
  }
}
