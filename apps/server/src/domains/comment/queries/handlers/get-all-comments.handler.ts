import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CommentRepository } from '@app/domains/comment/repositories/comment.repository';
import { GetAllCommentsQuery } from '@app/domains/comment/queries/impl/get-all-comments.query';
import { Comment } from './../../entities/comment.entity';

@QueryHandler(GetAllCommentsQuery)
export class GetAllCommentsHandler  {
 
}