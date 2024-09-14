import { IQuery } from '@nestjs/cqrs';

export class GetSprintsByProjectIdQuery implements IQuery {
  constructor(
    public readonly projectId: string,
    public readonly limit: number,
    public readonly page: number
  ) {}
}