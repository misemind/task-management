import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentRepository } from '@app/domains/comment/repositories/comment.repository';
import { GetCommentByIdQuery } from '@app/domains/comment/queries/impl/get-comment-by-id.query';
import { Comment } from './../../entities/comment.entity';

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(private readonly commentRepository: CommentRepository) { }

  async execute(query: GetCommentByIdQuery): Promise<Comment | null> {
    return this.commentRepository.findById(query.commentId);
  }
}