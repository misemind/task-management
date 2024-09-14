import { IQuery } from '@nestjs/cqrs';

export class GetAllCommentsQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}