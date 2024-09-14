import { IQuery } from '@nestjs/cqrs';

export class GetProjectEmployeesByProjectQuery implements IQuery {
  constructor(
    public readonly projectId: string,
    public readonly limit: number,
    public readonly skip: number,
  ) {}
}