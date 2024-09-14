import { IQuery } from '@nestjs/cqrs';

export class GetSprintByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}