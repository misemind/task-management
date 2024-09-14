import { IQuery } from '@nestjs/cqrs';

export class GetEmployeeExperiencesQuery implements IQuery {
  constructor(public readonly employee_id: string) {}
}
