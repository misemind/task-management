import { IQuery } from '@nestjs/cqrs';

export class GetAllEmployeesQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}
