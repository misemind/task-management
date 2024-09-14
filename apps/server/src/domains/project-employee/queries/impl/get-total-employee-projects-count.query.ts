
// apps/server/src/domains/project-employee/queries/impl/get-total-employee-projects-count.query.ts
import { IQuery } from '@nestjs/cqrs';

export class GetTotalEmployeeProjectsCountQuery implements IQuery {
  constructor(public readonly employeeId: string) {}
}
