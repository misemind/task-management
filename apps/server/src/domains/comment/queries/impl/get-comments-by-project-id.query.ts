import { IQuery } from '@nestjs/cqrs';

export class GetCommentsByProjectIdQuery implements IQuery {
  constructor(
    public readonly projectId: string,
    public readonly limit: number = 10,
    public readonly page: number = 1,  // Default page is 1
  ) {}
}
