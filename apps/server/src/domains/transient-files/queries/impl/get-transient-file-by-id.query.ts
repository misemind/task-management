import { IQuery } from '@nestjs/cqrs';

export class GetTransientFileByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
