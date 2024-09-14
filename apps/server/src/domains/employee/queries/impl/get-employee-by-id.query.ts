import { IQuery } from '@nestjs/cqrs';

export class GetEmployeeByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
