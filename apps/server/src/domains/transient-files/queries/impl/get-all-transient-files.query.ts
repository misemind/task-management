import { IQuery } from '@nestjs/cqrs';

export class GetAllTransientFilesQuery implements IQuery {
  constructor(
    public readonly limit: number,
    public readonly page: number,
  ) {}
}