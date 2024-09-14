import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentRepository } from '@app/domains/comment/repositories/comment.repository';
import { GetCommentsByProjectIdQuery } from '@app/domains/comment/queries/impl/get-comments-by-project-id.query';
import { Comment } from '@app/domains/comment/entities/comment.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@QueryHandler(GetCommentsByProjectIdQuery)
@Injectable()
export class GetCommentsByProjectIdHandler implements IQueryHandler<GetCommentsByProjectIdQuery> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(query: GetCommentsByProjectIdQuery): Promise<Comment[]> {
    const { projectId, limit, page } = query;
    const skip = (page - 1) * limit;  // Calculate skip based on page

    const comments = await this.commentRepository.findCommentsByProjectId(projectId, limit, skip);

    // if (!comments || comments.length === 0) {
    //   throw new NotFoundException('No comments found for this project');
    // }

    return comments;
  }
}