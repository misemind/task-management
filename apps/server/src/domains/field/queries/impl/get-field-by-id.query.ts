import { IQuery } from '@nestjs/cqrs';

export class GetFieldByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}