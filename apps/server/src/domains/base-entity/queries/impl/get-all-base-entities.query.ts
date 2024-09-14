import { IQuery } from '@nestjs/cqrs';

export class GetAllBaseEntitiesQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}