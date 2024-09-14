import { IQuery } from '@nestjs/cqrs';

export class GetAllProjectsQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}
