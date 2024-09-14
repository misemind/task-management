import { IQuery } from '@nestjs/cqrs';

export class GetActivityByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}