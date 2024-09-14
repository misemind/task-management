import { IQuery } from '@nestjs/cqrs';

export class GetBoardByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}