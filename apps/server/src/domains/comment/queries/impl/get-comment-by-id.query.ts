import { IQuery } from '@nestjs/cqrs';

export class GetCommentByIdQuery implements IQuery {
  constructor(public readonly commentId: string) {}
}