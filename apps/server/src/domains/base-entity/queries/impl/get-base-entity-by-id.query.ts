import { IQuery } from '@nestjs/cqrs';

export class GetBaseEntityByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}