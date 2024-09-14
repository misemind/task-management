import { IQuery } from '@nestjs/cqrs';

export class GetProjectByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
