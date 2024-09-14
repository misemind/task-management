import { IQuery } from '@nestjs/cqrs';

export class GetIssuesByProjectIdQuery implements IQuery {
  constructor(
    public readonly projectId: string,
    public readonly limit: number,
    public readonly page: number
  ) {}
}