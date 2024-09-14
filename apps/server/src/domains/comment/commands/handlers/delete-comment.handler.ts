import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '@app/domains/comment/repositories/comment.repository';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { DeleteCommentCommand } from '@app/domains/comment/commands/impl/delete-comment.command';
import { Injectable, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteCommentCommand)
@Injectable()
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly projectRepository: ProjectRepository,
  ) { }

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { id } = command;

    // Find the comment to delete
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Delete the comment
    await this.commentRepository.delete(id);

    // Update the project by removing the comment reference
    //await this.projectRepository.removeComment(comment.projectId, id);

    // If the comment has a parent, remove it from the parent's replies
    if (comment.parentId) {
      await this.commentRepository.removeReply(comment.parentId, id);
    }
  }
}