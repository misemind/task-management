import { IQuery } from '@nestjs/cqrs';

export class GetBoardsByProjectIdQuery implements IQuery {
  constructor(
    public readonly projectId: string,
    public readonly limit: number,
    public readonly page: number
  ) {}
}