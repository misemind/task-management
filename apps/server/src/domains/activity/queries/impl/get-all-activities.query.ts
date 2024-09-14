import { IQuery } from '@nestjs/cqrs';

export class GetAllActivitiesQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}