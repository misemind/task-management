import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '@app/domains/comment/repositories/comment.repository';
import { UpdateCommentCommand } from '@app/domains/comment/commands/impl/update-comment.command';
import { Injectable, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateCommentCommand)
@Injectable()
export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) { }

  async execute(command: UpdateCommentCommand): Promise<void> {
    const { id, content } = command;

    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.content = content;
    await this.commentRepository.update(id, comment);
  }
}