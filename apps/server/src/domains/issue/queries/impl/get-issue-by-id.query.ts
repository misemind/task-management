import { IQuery } from '@nestjs/cqrs';

export class GetIssueByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}