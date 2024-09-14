// apps/server/src/domains/project-employee/queries/impl/get-total-project-employees-count.query.ts
import { IQuery } from '@nestjs/cqrs';

export class GetTotalProjectEmployeesCountQuery implements IQuery {
  constructor(public readonly projectId: string) {}
}
