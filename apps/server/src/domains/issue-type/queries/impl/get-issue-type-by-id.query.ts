import { IQuery } from '@nestjs/cqrs';

export class GetIssueTypeByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}